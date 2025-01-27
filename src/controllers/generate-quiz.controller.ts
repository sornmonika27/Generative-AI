import { Request, Response } from "express";

export const quize = async (req: Request, res: Response) => {
    const {topic} = req.body;

    
    if(!topic){
        return res.status(404).json({
            message: "topic is required"
        })
    }
   try{
    if (topic){
        return res.status(200).json(
            {
                "quiz": [
                  {
                      "id": "1", // Generate this Id in back-end
                    "question": "What is JavaScript?",
                    "options": ["A programming language", "A database", "A web server", "None of the above"],
                    "correctAnswer": "A programming language"
                  }
                ]
              }
              
        );
    }
    }catch(error){
        console.error(error);
        res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
        res.end();
    }
   } 
   