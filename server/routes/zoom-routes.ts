import { Express, Request, Response } from 'express';
import { zoomService } from '../services/zoom-service';
import { z } from 'zod';

const meetingIdSchema = z.object({
  meetingId: z.string().min(8).max(15)
});

export function registerZoomRoutes(app: Express) {
  // Get Zoom join URL for a meeting
  app.post('/api/get-zoom-link', async (req: Request, res: Response) => {
    try {
      const validation = meetingIdSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid meeting ID', 
          details: validation.error.format() 
        });
      }
      
      const { meetingId } = validation.data;
      const joinUrl = await zoomService.getJoinUrl(meetingId);
      
      if (!joinUrl) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      return res.json({ join_url: joinUrl });
    } catch (error) {
      console.error('Error getting Zoom link:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get upcoming Zoom sessions
  app.get('/api/zoom/upcoming-sessions', async (_req: Request, res: Response) => {
    try {
      const sessions = await zoomService.getUpcomingSessions();
      return res.json(sessions);
    } catch (error) {
      console.error('Error getting upcoming sessions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}