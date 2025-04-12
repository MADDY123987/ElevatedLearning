import axios from 'axios';

interface ZoomMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
}

export class ZoomService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // For actual implementation, this would use OAuth 2.0 flow
    // For demo purposes, we're mocking a token here
    const expiresIn = 3600; // 1 hour in seconds
    this.accessToken = 'mock_zoom_access_token';
    this.tokenExpiry = Date.now() + expiresIn * 1000;
    
    return this.accessToken;
  }

  async getMeetingInfo(meetingId: string): Promise<ZoomMeeting | null> {
    try {
      // For full implementation, this would call the real Zoom API
      // For demo, we'll return mock data
      return {
        id: meetingId,
        topic: 'Mock Zoom Meeting',
        start_time: new Date().toISOString(),
        duration: 60,
        join_url: `https://zoom.us/j/${meetingId}`
      };
      
      // In a real implementation, we would do:
      /*
      const token = await this.getAccessToken();
      const response = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Error fetching Zoom meeting:', error);
      return null;
    }
  }

  async getJoinUrl(meetingId: string): Promise<string | null> {
    const meeting = await this.getMeetingInfo(meetingId);
    return meeting ? meeting.join_url : null;
  }
  
  // This would be used for the live sessions feature to display upcoming sessions
  async getUpcomingSessions(): Promise<ZoomMeeting[]> {
    // For demo purposes, we're returning mock data
    const sessions: ZoomMeeting[] = [
      {
        id: '1234567890',
        topic: 'Introduction to Web Development',
        start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 60,
        join_url: 'https://zoom.us/j/1234567890'
      },
      {
        id: '2345678901',
        topic: 'Advanced JavaScript Concepts',
        start_time: new Date(Date.now() + 2 * 86400000).toISOString(), // Day after tomorrow
        duration: 90,
        join_url: 'https://zoom.us/j/2345678901'
      },
      {
        id: '3456789012',
        topic: 'Building React Applications',
        start_time: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days from now
        duration: 120,
        join_url: 'https://zoom.us/j/3456789012'
      },
      {
        id: '4567890123',
        topic: 'Introduction to Node.js',
        start_time: new Date(Date.now() + 4 * 86400000).toISOString(), // 4 days from now
        duration: 60,
        join_url: 'https://zoom.us/j/4567890123'
      }
    ];
    
    return sessions;
  }
}

export const zoomService = new ZoomService();