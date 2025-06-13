import MapUtil from '../../../utils/map-util';

export default class HomePage {
  constructor() {
    this._stories = [];
    this._presenter = null;
  }

  async render() {
    return `
      <a href="#main-content" class="skip-link">Skip to content</a>
      <div class="home-container">
        <main id="main-content" class="home-content">
          <div id="map" class="map" role="application" aria-label="Stories map"></div>
          
          <div class="stories-container">
            <div class="stories-header">
              <h2 class="stories-title">Recent Stories</h2>
            </div>
            
            <div id="storiesList" class="stories-list">
              <div class="loading-spinner">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  _renderStories() {
    if (this._stories.length === 0) {
      return '<div class="no-stories">No stories found</div>';
    }

    return this._stories.map(story => `
      <article class="story-card">
        <img src="${story.photoUrl}" class="story-image" alt="Story photo by ${story.name}">
        <div class="story-content">
          <h2 class="story-title">${story.name}</h2>
          <p class="story-description">${story.description}</p>
          <div class="story-meta">
            <p class="story-date">
              <i class="fa fa-calendar" aria-hidden="true"></i> ${new Date(story.createdAt).toLocaleDateString()}
            </p>
            ${story.lat && story.lon ? `
              <p class="story-location">
                <i class="fa fa-map-marker" aria-hidden="true"></i> Location: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
              </p>
            ` : ''}
          </div>
          <a href="#/stories/${story.id}" class="read-more-button">Read More</a>
        </div>
      </article>
    `).join('');
  }

  async afterRender() {
    try {
      this._presenter.getStories();
      
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
          try {
            await this._presenter.logout();
          } catch (error) {
            console.error('Error logging out:', error);
            this.showError('Failed to logout');
          }
        });
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      this.showError('Failed to load stories');
    }
  }

  setPresenter(presenter) {
    this._presenter = presenter;
  }

  // Navigation methods
  navigateToLogin() {
    window.location.hash = '#/login';
  }

  // UI feedback methods
  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  // Method called by presenter to display stories
  displayStories(stories) {
    this._stories = stories;
    const storiesContainer = document.getElementById('storiesList');
    if (storiesContainer) {
      requestAnimationFrame(() => {
        storiesContainer.innerHTML = this._renderStories();
      });
    }
  }

  // Method called by presenter to initialize and display map with stories
  initializeMapWithStories(stories) {
     this._stories = stories;
     const defaultCenter = [106.8456, -6.2088];
     let center = defaultCenter;
     let zoom = 12;

     const storiesWithLocation = this._stories.filter(story => story.lat && story.lon);
     if (storiesWithLocation.length > 0) {
       center = [storiesWithLocation[0].lon, storiesWithLocation[0].lat];
       if (storiesWithLocation.length > 1) {
         zoom = 10;
       }
     }

     this._map = MapUtil.createMap('map', center, zoom);
     MapUtil.addMarkersWithStories(this._map, this._stories, 'map');
  }
} 