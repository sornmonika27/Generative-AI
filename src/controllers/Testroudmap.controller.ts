import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Roadmap } from "../entity/roadmap.entity";
import { UserInfo } from "../entity/user.entity";
import { Milestone } from "../entity/milestone.entity";
import { extractArrayRoadmap } from "../utils/extractArray";
import { ollamaNoStream } from "../service/ollamaChat";

export const roadmap = async (req: Request, res: Response) => {
    // We got the goal from postman
    const { goal } = req.body;
    console.log(goal)
    // (roadmapRepo, userInfo, milestone)  we use to connect from the model
    const roadmapRepo = AppDataSource.getRepository(Roadmap);
    const userInfo = AppDataSource.getRepository(UserInfo);
    const milestone = AppDataSource.getRepository(Milestone);

    // this line if not goal it's will return 404 message goal is required
    if (!goal) {
        return res.status(404).json({
            message: "Goal is required"
        });
    }

    try {
        // This line it's find id user for know who inpu or search this title        
        const user = await userInfo.findOne ({where:{id: req.user?.id}});
        // if not user it's will respons User not fonud
        if(!user){
            return res.status(404).json({
                message:"User not fonud"
            });
        }
        // This line it store the new data from the user when thet input the new data like searching new this example How 
        // Class is a blueprint and new mean create new object
        // object is a instance of class 
        const newRoadmap = new Roadmap();
        // This line take user from model or entity by the table
        // user we call property
        newRoadmap.user = user;
        newRoadmap.title = goal;
        await roadmapRepo.save(newRoadmap);

        const query = `
            You are a helpful software development assistant. I want you to create a learning roadmap in the form of an array of objects. Each object should contain two properties: 
        
'title': A milestone or step in the roadmap.
'description': A detail (50 words) description of that step.

        Your response only be in this format without any other text outside of array
        [
        {
            "title": "Step 1 Title",
            "description": "Step 1 Description"
        },
        {
            "title": "Step 2 Title",
            "description": "Step 2 Description"
        }
        ]

        Now, create a ${goal} roadmap.
        `

        const respones = await ollamaNoStream([{role: 'user', content: query}]);
        const milestoneArray = extractArrayRoadmap(respones.message.content) ?? []

        console.log(milestoneArray);

        for(const item of milestoneArray){
            const Newmilestone = new Milestone();
            Newmilestone.roadmap = newRoadmap;
            Newmilestone.title = item.title;
            Newmilestone.description = item.description
            await milestone.save(Newmilestone);
        }
        

        // This line use to respones data when it's successfully 
        return res.status(200).json({
           "roadmapId": newRoadmap.id,
           "title": newRoadmap.title,
           "milestone": newRoadmap.milestones
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};




export const getAllRoadmap = async (req: Request, res: Response) => {
    const roadmapRepo = AppDataSource.getRepository(Roadmap);

    try {
        // Fetch all roadmaps with their milestones
        const roadmaps = await roadmapRepo.find({
            relations: ["milestones"] // Ensure milestones are included
        });

        return res.status(200).json({
            message: "Roadmaps fetched successfully",
            roadmaps: roadmaps.map(roadmap => ({
                id: roadmap.id,
                title: roadmap.title,
                milestones: roadmap.milestones.map(milestone => ({
                    id: milestone.id,
                    title: milestone.title,
                    description: milestone.description
                }))
            }))
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getRoadmapById = async (req:Request, res: Response) =>{
    const {id} = req.body;
    const roadmapRepo = AppDataSource.getMongoRepository(Roadmap);
    try{
        const roadmap = await roadmapRepo.findOneBy({id: parseInt(id)});
        if (!roadmap){
            return res.status(404).json({
                message: "Roadmap not found"
            })
        }
        return res.status(200).json({
            message: "Roadmap fetched successfully",
            roadmap,
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }

}