import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.118.0';

const SUPABASE_URL = 'https://iejywhofupozeyjuiijc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ZLSIZspso_n8A7WzB6aSKg_eYfuFI7S';
const PHOTO_BUCKET = 'travel-photos';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const postsRoot = $('#community-posts');
const feedStatus = $('#feed-status');
const authDialog = $('#auth-dialog');
const postDialog = $('#post-dialog');
const profileDialog = $('#profile-dialog');
const publicProfileDialog = $('#public-profile-dialog');
const reportDialog = $('#report-dialog');
const authForm = $('#auth-form');
const postForm = $('#post-form');
const profileForm = $('#profile-form');
const reportForm = $('#report-form');

let currentUser = null;
let currentProfile = null;
let feedPosts = [];
let activeFilter = 'all';
let likedPostIds = new Set();
let followingIds = new Set();
let reportPostId = null;
let authMode = 'signup';

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function safeImageUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function initials(name) {
  const cleanName = String(name || 'Raahi').trim();
  return Array.from(cleanName)[0]?.toUpperCase() || 'R';
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('error', isError);
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function openAuth(mode = 'signup') {
  if (currentUser) {
    openPostDialog();
    return;
  }
  setAuthMode(mode);
  setStatus($('#auth-status'), '');
  openDialog(authDialog);
  setTimeout(() => (mode === 'signup' ? $('#signup-name') : $('#auth-email'))?.focus(), 20);
}

function openPostDialog() {
  if (!currentUser) {
    openAuth('signup');
    return;
  }
  setStatus($('#post-status'), '');
  openDialog(postDialog);
  setTimeout(() => $('#post-category')?.focus(), 20);
}

function openProfileDialog() {
  if (!currentUser) return openAuth('signup');
  const profile = currentProfile || {};
  $('#profile-display-name').value = profile.display_name || currentUser.user_metadata?.display_name || '';
  $('#profile-home-base').value = profile.home_base || '';
  $('#profile-travel-style').value = profile.travel_style || '';
  $('#profile-bio-input').value = profile.bio || '';
  $('#profile-char-count').textContent = String($('#profile-bio-input').value.length);
  setStatus($('#profile-status'), '');
  openDialog(profileDialog);
  setTimeout(() => $('#profile-display-name')?.focus(), 20);
}

function renderAccountMenu() {
  const menu = $('#account-popover');
  if (!menu) return;
  menu.replaceChildren();
  if (!currentUser) return;
  const name = currentProfile?.display_name || currentUser.user_metadata?.display_name || 'Traveller';
  const heading = node('span', 'account-popover-name', name);
  heading.append(node('span', 'account-popover-detail', 'Your Raahi account'));
  const profileButton = node('button', 'account-menu-button', 'Edit profile & settings');
  profileButton.type = 'button';
  profileButton.addEventListener('click', () => { menu.hidden = true; openProfileDialog(); });
  const storyButton = node('button', 'account-menu-button', 'Write a post or blog');
  storyButton.type = 'button';
  storyButton.addEventListener('click', () => { menu.hidden = true; openPostDialog(); });
  const signoutButton = node('button', 'account-menu-button danger', 'Sign out');
  signoutButton.type = 'button';
  signoutButton.addEventListener('click', signOut);
  menu.append(heading, profileButton, storyButton, signoutButton);
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) window.alert(friendlyError(error));
  $('#account-popover').hidden = true;
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = mode === 'signup';
  $('#auth-title').textContent = signingUp ? 'Join the Raahi community.' : 'Welcome back to Raahi.';
  $('#signup-name-wrap').hidden = !signingUp;
  $('#signup-name').required = signingUp;
  $('#auth-password').autocomplete = signingUp ? 'new-password' : 'current-password';
  $('#auth-password').minLength = signingUp ? 8 : 1;
  $('#auth-submit').textContent = signingUp ? 'Create my account' : 'Sign in';
  $$('[data-auth-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.authMode === mode));
  });
  setStatus($('#auth-status'), '');
}

function formattedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function categoryName(category) {
  return ({
    experience: 'Experience',
    destination: 'Place recommendation',
    photo: 'Photo diary',
    blog: 'Trail blog',
    gear: 'Gear tip',
    idea: 'Trip idea'
  })[category] || 'Traveller story';
}

function profileFor(post) {
  const relation = post.profiles;
  return Array.isArray(relation) ? relation[0] || {} : relation || {};
}

function makeAvatar(profile, className = 'profile-avatar') {
  const avatar = node('span', className);
  const url = safeImageUrl(profile?.avatar_url);
  if (url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = '';
    image.loading = 'lazy';
    avatar.append(image);
  } else {
    avatar.textContent = initials(profile?.display_name);
    avatar.setAttribute('aria-hidden', 'true');
  }
  return avatar;
}

function setCommunitySummary() {
  const primary = $('#community-primary');
  const secondary = $('#community-secondary');
  const detail = $('#community-detail');
  const navAction = $('#nav-community-button');
  const settingsButton = $('#community-settings');
  const bio = $('#community-bio');
  navAction.replaceChildren(document.createTextNode(currentUser ? 'Share a story ' : 'Join Raahi '));
  const navArrow = node('span', '', '↗');
  navArrow.setAttribute('aria-hidden', 'true');
  navAction.append(navArrow);
  if (!currentUser) {
    $('#community-name').textContent = 'Browsing as a guest';
    detail.textContent = 'Join to follow and share';
    $('#community-avatar').textContent = 'r';
    $('#followers-count').textContent = '—';
    $('#following-count').textContent = '—';
    primary.textContent = 'Join the community';
    primary.className = 'button button-dark';
    secondary.hidden = true;
    settingsButton.hidden = true;
    bio.textContent = 'Browse mountain stories freely. Join when you want to post, follow or comment.';
    $('#account-note').textContent = 'Free to join. Your email stays private; your profile name, posts and photos are public.';
    return;
  }

  const displayName = currentProfile?.display_name || currentUser.user_metadata?.display_name || 'Traveller';
  $('#community-name').textContent = displayName;
  detail.textContent = [currentProfile?.home_base, currentProfile?.travel_style].filter(Boolean).join(' · ') || 'Raahi traveller';
  bio.textContent = currentProfile?.bio || 'Add a short traveller bio, favourite region and travel style.';
  const avatar = $('#community-avatar');
  if (avatar) {
    const nextAvatar = makeAvatar(currentProfile || { display_name: displayName }, 'profile-avatar');
    nextAvatar.id = 'community-avatar';
    avatar.replaceWith(nextAvatar);
  }
  $('#followers-count').textContent = '…';
  $('#following-count').textContent = '…';
  primary.textContent = '＋ Share a story';
  secondary.hidden = false;
  settingsButton.hidden = false;
  $('#account-note').textContent = 'Your email is private. Public posts and photos can be seen by anyone.';
}

async function loadProfileStats() {
  if (!currentUser) return;
  const [followers, following] = await Promise.all([
    supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', currentUser.id),
    supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', currentUser.id)
  ]);
  if (!followers.error) $('#followers-count').textContent = String(followers.count ?? 0);
  if (!following.error) $('#following-count').textContent = String(following.count ?? 0);
}

async function loadViewer() {
  if (!currentUser) {
    currentProfile = null;
    likedPostIds = new Set();
    followingIds = new Set();
    setCommunitySummary();
    renderAccountMenu();
    return;
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('id,display_name,avatar_url,bio,home_base,travel_style')
    .eq('id', currentUser.id)
    .maybeSingle();
  if (error) throw error;
  currentProfile = data || { id: currentUser.id, display_name: currentUser.user_metadata?.display_name || 'Traveller' };
  setCommunitySummary();
  renderAccountMenu();
  await loadProfileStats();
}

function emptyFeed(title, copy) {
  const empty = node('div', 'feed-empty');
  empty.append(node('span', 'feed-empty-mark', '↟'));
  empty.lastChild.setAttribute('aria-hidden', 'true');
  empty.append(node('h3', '', title), node('p', '', copy));
  return empty;
}

function renderFeed() {
  postsRoot.replaceChildren();
  const filtered = activeFilter === 'all'
    ? feedPosts
    : feedPosts.filter((post) => post.category === activeFilter);
  feedStatus.textContent = activeFilter === 'all'
    ? `${feedPosts.length} ${feedPosts.length === 1 ? 'story' : 'stories'} · newest first`
    : `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'} in ${categoryName(activeFilter).toLowerCase()}`;
  if (!filtered.length) {
    postsRoot.append(emptyFeed(
      feedPosts.length ? 'No stories in this filter yet.' : 'Start the first trail story.',
      feedPosts.length ? 'Try another story type, or share something in this category.' : 'Share a place you loved, a photo, or one useful thing you learned on the way.'
    ));
    return;
  }
  filtered.forEach((post) => postsRoot.append(renderPost(post)));
}

function renderPost(post) {
  const profile = profileFor(post);
  const displayName = profile.display_name || 'Traveller';
  const article = node('article', 'feed-post');
  const header = node('div', 'feed-post-head');
  const authorButton = node('button', 'post-author');
  authorButton.type = 'button';
  authorButton.setAttribute('aria-label', `Open ${displayName}'s traveller profile`);
  authorButton.addEventListener('click', () => openPublicProfile(post.author_id, profile));
  authorButton.append(makeAvatar(profile));
  const byline = node('div', 'post-byline');
  byline.append(node('strong', '', displayName), node('span', '', formattedDate(post.created_at)));
  authorButton.append(byline);
  header.append(authorButton);
  const headActions = node('div', 'post-head-actions');

  if (currentUser && currentUser.id !== post.author_id) {
    const followButton = node('button', 'follow-button', followingIds.has(post.author_id) ? 'Following' : '＋ Follow');
    followButton.type = 'button';
    followButton.setAttribute('aria-pressed', String(followingIds.has(post.author_id)));
    followButton.setAttribute('aria-label', `${followingIds.has(post.author_id) ? 'Unfollow' : 'Follow'} ${displayName}`);
    followButton.addEventListener('click', () => toggleFollow(post.author_id, followButton));
    headActions.append(followButton);
  }
  if (currentUser && currentUser.id === post.author_id) {
    const deleteButton = node('button', 'delete-button', 'Delete');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete ${post.title}`);
    deleteButton.addEventListener('click', () => deletePost(post, deleteButton));
    headActions.append(deleteButton);
  } else if (currentUser) {
    const reportButton = node('button', 'report-button', 'Report');
    reportButton.type = 'button';
    reportButton.setAttribute('aria-label', `Report ${post.title}`);
    reportButton.addEventListener('click', () => openReport(post.id));
    headActions.append(reportButton);
  }
  if (headActions.childElementCount) header.append(headActions);
  article.append(header);

  const content = node('div', 'post-content');
  content.append(node('span', 'post-category', categoryName(post.category)));
  content.append(node('h3', '', post.title));
  content.append(node('p', 'post-destination', `⌖ ${post.destination}`));
  content.append(node('p', 'post-body', post.body));
  const photoUrl = safeImageUrl(post.image_url);
  if (photoUrl) {
    const image = document.createElement('img');
    image.className = 'post-image';
    image.src = photoUrl;
    image.alt = `Photo shared with ${post.title}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    content.append(image);
  }
  article.append(content);

  const actions = node('div', 'post-actions');
  const liked = likedPostIds.has(post.id);
  const likeButton = node('button', 'post-action', `${liked ? '♥' : '♡'}  ${post.like_count || 0}`);
  likeButton.type = 'button';
  likeButton.setAttribute('aria-pressed', String(liked));
  likeButton.setAttribute('aria-label', `${liked ? 'Unlike' : 'Like'} ${post.title}; ${post.like_count || 0} likes`);
  likeButton.addEventListener('click', () => toggleLike(post, likeButton));
  const commentButton = node('button', 'post-action', 'Comment');
  commentButton.type = 'button';
  commentButton.setAttribute('aria-expanded', 'false');
  const panel = node('div', 'comment-panel');
  panel.hidden = true;
  panel.id = `comments-${post.id}`;
  commentButton.setAttribute('aria-controls', panel.id);
  commentButton.addEventListener('click', async () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    commentButton.setAttribute('aria-expanded', String(opening));
    if (opening && !panel.dataset.loaded) await loadComments(post, panel);
  });
  actions.append(likeButton, commentButton);
  article.append(actions, panel);
  return article;
}

async function openPublicProfile(authorId, postProfile = {}) {
  const content = $('#public-profile-content');
  content.replaceChildren(node('p', 'dialog-intro', 'Loading this traveller’s profile…'));
  openDialog(publicProfileDialog);
  try {
    const [profileResult, followerResult, postResult] = await Promise.all([
      supabase.from('profiles').select('id,display_name,avatar_url,bio,home_base,travel_style').eq('id', authorId).maybeSingle(),
      supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', authorId),
      supabase.from('posts').select('id,category,destination,title,created_at').eq('author_id', authorId).order('created_at', { ascending: false }).limit(4)
    ]);
    if (profileResult.error) throw profileResult.error;
    if (followerResult.error) throw followerResult.error;
    if (postResult.error) throw postResult.error;
    const profile = profileResult.data || postProfile || {};
    const name = profile.display_name || 'Traveller';
    const head = node('div', 'public-profile-head');
    head.append(makeAvatar(profile));
    const identity = node('div');
    identity.append(node('h2', '', name));
    identity.append(node('p', '', [profile.home_base, profile.travel_style].filter(Boolean).join(' · ') || 'Raahi traveller'));
    head.append(identity);
    const bio = node('p', 'public-profile-bio', profile.bio || 'This traveller has not added a bio yet.');
    const stats = node('div', 'public-profile-stats');
    const followers = node('span');
    followers.append(node('strong', '', String(followerResult.count ?? 0)), document.createTextNode('followers'));
    const stories = node('span');
    stories.append(node('strong', '', String(postResult.data?.length ?? 0)), document.createTextNode('recent stories'));
    stats.append(followers, stories);
    const storyList = node('div', 'public-profile-stories');
    const entries = postResult.data || [];
    if (entries.length) {
      entries.forEach((story) => {
        const card = node('article', 'public-story');
        card.append(node('span', '', categoryName(story.category)), node('h3', '', story.title), node('p', '', `⌖ ${story.destination}`));
        storyList.append(card);
      });
    } else {
      storyList.append(node('p', 'dialog-intro', 'No public stories from this traveller yet.'));
    }
    content.replaceChildren(head, bio, stats, storyList);
  } catch (error) {
    content.replaceChildren(node('p', 'dialog-intro error', friendlyError(error)));
  }
}

async function refreshFeed() {
  postsRoot.setAttribute('aria-busy', 'true');
  if (feedStatus) feedStatus.textContent = 'Loading stories…';
  const { data, error } = await supabase
    .from('posts')
    .select('id,author_id,category,destination,title,body,image_url,image_path,like_count,created_at,profiles!posts_author_id_fkey(display_name,avatar_url)')
    .order('created_at', { ascending: false })
    .limit(40);
  if (error) throw error;
  feedPosts = data || [];
  likedPostIds = new Set();
  followingIds = new Set();
  const postIds = feedPosts.map((post) => post.id);
  const authorIds = [...new Set(feedPosts.map((post) => post.author_id).filter((id) => id !== currentUser?.id))];
  const lookups = [];
  if (currentUser && postIds.length) {
    lookups.push(supabase.from('likes').select('post_id').eq('user_id', currentUser.id).in('post_id', postIds));
  }
  if (currentUser && authorIds.length) {
    lookups.push(supabase.from('follows').select('following_id').eq('follower_id', currentUser.id).in('following_id', authorIds));
  }
  if (lookups.length) {
    const results = await Promise.all(lookups);
    for (const result of results) if (result.error) throw result.error;
    let index = 0;
    if (currentUser && postIds.length) {
      likedPostIds = new Set((results[index].data || []).map((row) => row.post_id));
      index += 1;
    }
    if (currentUser && authorIds.length) {
      followingIds = new Set((results[index].data || []).map((row) => row.following_id));
    }
  }
  renderFeed();
  postsRoot.setAttribute('aria-busy', 'false');
}

function friendlyError(error) {
  const message = String(error?.message || 'Something went wrong. Please try again.');
  if (/failed to fetch|network|load failed/i.test(message)) return 'Raahi could not connect just now. Check your connection and try again.';
  if (/duplicate key|already exists/i.test(message)) return 'You have already done that.';
  if (/row-level security|permission denied/i.test(message)) return 'Please sign in again, then retry that action.';
  return message;
}

async function toggleLike(post, button) {
  if (!currentUser) return openAuth('signin');
  button.disabled = true;
  try {
    const alreadyLiked = likedPostIds.has(post.id);
    const result = alreadyLiked
      ? await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id)
      : await supabase.from('likes').insert({ post_id: post.id, user_id: currentUser.id });
    if (result.error) throw result.error;
    await refreshFeed();
  } catch (error) {
    window.alert(friendlyError(error));
    button.disabled = false;
  }
}

async function toggleFollow(authorId, button) {
  if (!currentUser) return openAuth('signin');
  button.disabled = true;
  try {
    const alreadyFollowing = followingIds.has(authorId);
    const result = alreadyFollowing
      ? await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', authorId)
      : await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: authorId });
    if (result.error) throw result.error;
    await Promise.all([refreshFeed(), loadProfileStats()]);
  } catch (error) {
    window.alert(friendlyError(error));
    button.disabled = false;
  }
}

async function deletePost(post, button) {
  if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
  button.disabled = true;
  const { error } = await supabase.from('posts').delete().eq('id', post.id).eq('author_id', currentUser.id);
  if (error) {
    window.alert(friendlyError(error));
    button.disabled = false;
    return;
  }
  if (post.image_path) {
    const removed = await supabase.storage.from(PHOTO_BUCKET).remove([post.image_path]);
    if (removed.error) window.alert('Your post was deleted, but its photo could not be removed. Please try again later.');
  }
  await refreshFeed();
}

async function loadComments(post, panel) {
  panel.replaceChildren(node('p', 'comment-item', 'Loading notes…'));
  const { data, error } = await supabase
    .from('comments')
    .select('id,author_id,body,created_at,profiles!comments_author_id_fkey(display_name)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })
    .limit(40);
  if (error) {
    panel.replaceChildren(node('p', 'comment-item', friendlyError(error)));
    return;
  }
  panel.replaceChildren();
  const comments = node('div', 'comment-list');
  (data || []).forEach((comment) => {
    const commentProfile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
    const row = node('p', 'comment-item');
    row.append(node('strong', '', commentProfile?.display_name || 'Traveller'), document.createTextNode(comment.body));
    comments.append(row);
  });
  if (!data?.length) comments.append(node('p', 'comment-item', 'No notes yet. Add a kind and useful thought.'));
  panel.append(comments);
  if (currentUser) {
    const form = node('form', 'comment-form');
    const input = document.createElement('input');
    input.name = 'body';
    input.type = 'text';
    input.maxLength = 800;
    input.placeholder = 'Add a kind, useful note…';
    input.setAttribute('aria-label', `Comment on ${post.title}`);
    input.required = true;
    const submit = node('button', '', 'Send');
    submit.type = 'submit';
    form.append(input, submit);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      const result = await supabase.from('comments').insert({ post_id: post.id, author_id: currentUser.id, body: input.value.trim() });
      if (result.error) {
        window.alert(friendlyError(result.error));
        submit.disabled = false;
        return;
      }
      await loadComments(post, panel);
    });
    panel.append(form);
  } else {
    const signIn = node('p', 'comment-signin');
    signIn.append(document.createTextNode('Sign in to add a comment. '));
    const button = node('button', '', 'Join the conversation');
    button.type = 'button';
    button.addEventListener('click', () => openAuth('signup'));
    signIn.append(button);
    panel.append(signIn);
  }
  panel.dataset.loaded = 'true';
}

function openReport(postId) {
  if (!currentUser) return openAuth('signin');
  reportPostId = postId;
  reportForm.reset();
  setStatus($('#report-status'), '');
  openDialog(reportDialog);
  setTimeout(() => $('input[name="reason"]', reportForm)?.focus(), 20);
}

async function createPost(event) {
  event.preventDefault();
  if (!currentUser) {
    postDialog.close();
    return openAuth('signup');
  }
  const submit = $('#post-submit');
  const values = new FormData(postForm);
  const file = values.get('image');
  let imagePath = null;
  let imageUrl = null;
  submit.disabled = true;
  submit.textContent = 'Publishing…';
  setStatus($('#post-status'), file?.size ? 'Uploading photo and publishing your story…' : 'Publishing your story…');
  try {
    if (file instanceof File && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) throw new Error('Choose a JPG, PNG or WebP photo.');
      if (file.size > 5 * 1024 * 1024) throw new Error('Photos must be 5 MB or smaller.');
      const extension = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[file.type];
      imagePath = `${currentUser.id}/${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from(PHOTO_BUCKET).upload(imagePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
      if (upload.error) throw upload.error;
      imageUrl = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(imagePath).data.publicUrl;
    }
    const { error } = await supabase.from('posts').insert({
      author_id: currentUser.id,
      category: values.get('category'),
      destination: String(values.get('destination') || '').trim(),
      title: String(values.get('title') || '').trim(),
      body: String(values.get('body') || '').trim(),
      image_url: imageUrl,
      image_path: imagePath
    });
    if (error) throw error;
    postForm.reset();
    $('#post-char-count').textContent = '0';
    postDialog.close();
    await refreshFeed();
    document.querySelector('#stories').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    if (imagePath) await supabase.storage.from(PHOTO_BUCKET).remove([imagePath]);
    setStatus($('#post-status'), friendlyError(error), true);
  } finally {
    submit.disabled = false;
    submit.textContent = 'Publish story';
  }
}

async function saveProfile(event) {
  event.preventDefault();
  if (!currentUser) return openAuth('signup');
  const submit = $('#profile-submit');
  const values = new FormData(profileForm);
  submit.disabled = true;
  submit.textContent = 'Saving…';
  setStatus($('#profile-status'), 'Saving your public traveller profile…');
  try {
    const updates = {
      display_name: String(values.get('display_name') || '').trim(),
      home_base: String(values.get('home_base') || '').trim() || null,
      travel_style: String(values.get('travel_style') || '').trim() || null,
      bio: String(values.get('bio') || '').trim() || null
    };
    const { error } = await supabase.from('profiles').update(updates).eq('id', currentUser.id);
    if (error) throw error;
    currentProfile = { ...(currentProfile || {}), ...updates, id: currentUser.id };
    setCommunitySummary();
    renderAccountMenu();
    profileDialog.close();
    await refreshFeed();
  } catch (error) {
    setStatus($('#profile-status'), friendlyError(error), true);
  } finally {
    submit.disabled = false;
    submit.textContent = 'Save profile';
  }
}

async function submitAuth(event) {
  event.preventDefault();
  const submit = $('#auth-submit');
  const values = new FormData(authForm);
  const email = String(values.get('email') || '').trim();
  const password = String(values.get('password') || '');
  submit.disabled = true;
  submit.textContent = authMode === 'signup' ? 'Creating account…' : 'Signing in…';
  setStatus($('#auth-status'), authMode === 'signup' ? 'Creating your profile…' : 'Checking your account…');
  try {
    if (authMode === 'signup') {
      const displayName = String(values.get('display_name') || '').trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      if (data.session) {
        authDialog.close();
        currentUser = data.user;
        await loadViewer();
        await refreshFeed();
      } else {
        setStatus($('#auth-status'), 'Check your email for a confirmation link. After confirming, come back here and sign in.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      authDialog.close();
      currentUser = data.user;
      await loadViewer();
      await refreshFeed();
    }
  } catch (error) {
    setStatus($('#auth-status'), friendlyError(error), true);
  } finally {
    submit.disabled = false;
    submit.textContent = authMode === 'signup' ? 'Create my account' : 'Sign in';
  }
}

async function submitReport(event) {
  event.preventDefault();
  if (!currentUser || !reportPostId) return;
  const submit = $('#report-submit');
  const values = new FormData(reportForm);
  submit.disabled = true;
  setStatus($('#report-status'), 'Sending your private report…');
  try {
    const { error } = await supabase.from('post_reports').insert({
      post_id: reportPostId,
      reporter_id: currentUser.id,
      reason: values.get('reason'),
      details: String(values.get('details') || '').trim() || null
    });
    if (error) throw error;
    setStatus($('#report-status'), 'Thank you. Your report was sent privately for review.');
    setTimeout(() => reportDialog.close(), 900);
  } catch (error) {
    const message = /duplicate key|already exists/i.test(String(error.message))
      ? 'You have already reported this post.'
      : friendlyError(error);
    setStatus($('#report-status'), message, true);
  } finally {
    submit.disabled = false;
  }
}

function attachEvents() {
  $('#nav-community-button').addEventListener('click', () => {
    if (!currentUser) return openAuth('signup');
    const menu = $('#account-popover');
    menu.hidden = !menu.hidden;
  });
  $('#community-primary').addEventListener('click', () => currentUser ? openPostDialog() : openAuth('signup'));
  $('#community-secondary').addEventListener('click', signOut);
  $('#community-settings').addEventListener('click', openProfileDialog);
  $('#dock-create').addEventListener('click', openPostDialog);
  $('#dock-profile').addEventListener('click', () => currentUser ? openProfileDialog() : openAuth('signup'));
  $('#create-post-button').addEventListener('click', openPostDialog);
  $$('[data-auth-mode]').forEach((button) => button.addEventListener('click', () => setAuthMode(button.dataset.authMode)));
  $$('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));
  [authDialog, postDialog, profileDialog, publicProfileDialog, reportDialog].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
  authForm.addEventListener('submit', submitAuth);
  postForm.addEventListener('submit', createPost);
  profileForm.addEventListener('submit', saveProfile);
  reportForm.addEventListener('submit', submitReport);
  $('#post-body').addEventListener('input', (event) => {
    $('#post-char-count').textContent = String(event.target.value.length);
  });
  $('#profile-bio-input').addEventListener('input', (event) => {
    $('#profile-char-count').textContent = String(event.target.value.length);
  });
  $$('[data-feed-filter]').forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.feedFilter;
    $$('[data-feed-filter]').forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    renderFeed();
  }));
}

attachEvents();
setAuthMode('signup');
setCommunitySummary();

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user || null;
  window.setTimeout(async () => {
    try {
      await loadViewer();
      await refreshFeed();
    } catch (error) {
      feedStatus.textContent = friendlyError(error);
      postsRoot.replaceChildren(emptyFeed('The community feed could not load.', 'Please refresh the page and try again.'));
      postsRoot.setAttribute('aria-busy', 'false');
    }
  }, 0);
});

supabase.auth.getSession().then(async ({ data, error }) => {
  if (error) throw error;
  currentUser = data.session?.user || null;
  await loadViewer();
  await refreshFeed();
  if (!currentUser && !window.sessionStorage.getItem('raahi-welcome-seen')) {
    window.sessionStorage.setItem('raahi-welcome-seen', 'true');
    window.setTimeout(() => openAuth('signup'), 500);
  }
}).catch((error) => {
  feedStatus.textContent = friendlyError(error);
  postsRoot.replaceChildren(emptyFeed('The community feed could not load.', 'Please refresh the page and try again.'));
  postsRoot.setAttribute('aria-busy', 'false');
});
