import { addStory } from '../../../data/api';
import CameraUtil from '../../../utils/camera';
import MapUtil from '../../../utils/map-util';
import { getLocation } from '../../../utils/location';

class AddStoryPresenter {
  constructor(view) {
    this._view = view;
    this._map = null;
    this._marker = null;
  }

  initializeMap(containerId) {
    this._map = MapUtil.createMap(containerId);
    this._map.on('click', (e) => {
        const { lat, lng } = e.lngLat;
        this._view.updateLocationInput(lat, lng);
        this.addMarker(lat, lng);
        if (this._marker && this._map && this._view && typeof this._view.displayLocationPopup === 'function') {
            this._view.displayLocationPopup(this._marker, lat, lng, this._map);
        }
    });
  }

  addMarker(lat, lon) {
    if (this._marker) {
      this._marker.remove();
    }
    if (this._map) {
        this._marker = MapUtil.addMarker(this._map, [lon, lat]);
    }
  }

  async handleGetLocation(latitudeInputId, longitudeInputId) {
      try {
          const position = await getLocation();
          const { latitude, longitude } = position.coords;
          this._view.updateLocationInput(latitude, longitude);
          this.addMarker(latitude, longitude);

          if (this._map) {
              this._map.setCenter([longitude, latitude]);
              this._map.setZoom(14);
          }
          if (this._marker && this._map && this._view && typeof this._view.displayLocationPopup === 'function') {
            this._view.displayLocationPopup(this._marker, latitude, longitude, this._map);
          }

      } catch (error) {
          console.error('Error getting location:', error);
          this._view.showError('Failed to get current location.');
      }
  }

  initializeCamera(videoElementId, previewElementId, buttonsElementSelector, captureButtonId, retakeButtonId, closeButtonId, photoPreviewId, photoInputId) {
    CameraUtil.init(videoElementId, previewElementId, buttonsElementSelector, captureButtonId, retakeButtonId, closeButtonId, photoPreviewId, photoInputId);
  }

  startCamera() {
    CameraUtil.startCamera();
  }

  handleFileSelect(file, previewElementId) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this._view.displayPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  async submitStory(data) {
    try {
      await addStory(data);
      this._view.showSuccess('Story added successfully!');
      this._view.navigateToHome();
    } catch (error) {
      console.error('Error submitting story:', error);
      this._view.showError('Failed to add story: ' + (error.message || 'An error occurred'));
    }
  }
}

export default AddStoryPresenter; 