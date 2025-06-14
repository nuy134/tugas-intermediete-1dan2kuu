import CONFIG from '../config';
import AuthModel from '../models/auth-model';

const authModel = new AuthModel();

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

export async function getStories() {
  try {
    const user = authModel.getUser();
    
    if (!user || !user.token) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching stories with token:', user.token);

    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch stories');
    }

    const responseJson = await response.json();
    
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson.listStory;
  } catch (error) {
    console.error('Error in getStories:', error);
    throw error;
  }
}

export async function getStoryById(id) {
  try {
    const user = authModel.getUser();
    
    if (!user || !user.token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch story');
    }

    const responseJson = await response.json();
    
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson.story;
  } catch (error) {
    console.error('Error in getStoryById:', error);
    throw error;
  }
}

export async function addStory(data) {
  try {
    const user = authModel.getUser();
    
    if (!user || !user.token) {
      throw new Error('User not authenticated');
    }

    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('photo', data.photo);
    
    if (data.lat && data.lon) {
      formData.append('lat', data.lat);
      formData.append('lon', data.lon);
    }

    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add story');
    }

    const responseJson = await response.json();
    
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error in addStory:', error);
    throw error;
  }
}