import { Request, Response } from "express";
import ollama from 'ollama';

export const askQuery = async (req: Request, res: Response) => {
  const { query, isStream = false } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    if(isStream){
        // Start streaming the response to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    
        // Send an initial data packet to indicate streaming has started
        res.write('data: Streaming started\n\n');
    
        // Stream data from Ollama
        const stream = await ollama.chat({
          model: 'llama3.2',
          messages: [{ role: 'user', content: query }],
          stream: true
        });
    
        for await (const chunk of stream) {
          if (chunk.message && chunk.message.content) {
            // Send each chunk of the response as an event
            res.write(`data: ${JSON.stringify({ reply: chunk.message.content })}\n\n`);
          }
        }
    
        // Close the stream once finished
        res.write('data: [DONE]\n\n');
        res.end();
    }else {
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [{ role: 'user', content: query }],
          });
        res.status(200).json({ response: response.message.content }); 
    }
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
    res.end();
  }
};
