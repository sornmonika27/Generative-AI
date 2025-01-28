// import { Request, Response } from "express";
// import { AppDataSource } from "../config";
// import { Roadmap } from "../entity/roadmap.entity";
// import { UserInfo } from "../entity/user.entity";
// import { Milestone } from "../entity/milestone.entity";

// export const roadmap = async (req: Request, res: Response) => {
//     // We got the goal from postman
//     const { goal } = req.body;
//     // (roadmapRepo, userInfo, milestone)  we use to connect from the model
//     const roadmapRepo = AppDataSource.getRepository(Roadmap);
//     const userInfo = AppDataSource.getRepository(UserInfo);
//     const milestone = AppDataSource.getRepository(Milestone);

//     // this line if not goal it's will return 404 message goal is required
//     if (!goal) {
//         return res.status(404).json({
//             message: "Goal is required"
//         });
//     }

//     try {
//         // This line it's find id user for know who inpu or search this title        
//         const user = await userInfo.findOne ({where:{id: req.user?.id}});
//         // if not user it's will respons User not fonud
//         if(!user){
//             return res.status(404).json({
//                 message:"User not fonud"
//             });
//         }
//         // This line it store the new data from the user when thet input the new data like searching new this example How 
//         const newRoadmap = new Roadmap();
//         // This line take user from model or entity by the table
//         newRoadmap.user = user;
//         // this line is the title when user they fill but why i write the string because it's the static website
//         newRoadmap.title = "JavaScript Learning Roadmap";
//         newRoadmap.title = goal;
//         await roadmapRepo.save(newRoadmap);
//         // This line it store the new data from the user when thet input the new data like searching new this example How 
//         const Newmilestone = new Milestone();
//         Newmilestone.roadmap = newRoadmap;
//         Newmilestone.title = "Getting Started with JavaScript";
//         Newmilestone.description = "Learn the basics of JavaScript, variables, and functions."
//         await milestone.save(Newmilestone);

//         // This line use to respones data when it's successfully 
//         return res.status(200).json({
//             response: {
//                 goal: [
//                     {
//                         Id: newRoadmap.id, // Use the generated ID
//                         title: newRoadmap.title,
//                         milestones: [
//                             {
//                                 milestoneId: Newmilestone.id,
//                                 title: Newmilestone.title,
//                                 description: Newmilestone.description
//                             },
//                         ]
//                     }
//                 ]
//             }
//         });
//     }catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// export const getAllRoadmap = async (req: Request, res: Response) =>{
//     const roadmapRepo =  AppDataSource.getRepository(Roadmap);
//     try{
//         // fetch all roadmap from database
//         const roadmap = await roadmapRepo.find();
//         return res.status(200).json({
//             message: "Roadmap fetched successfully",
//             roadmap
//         });
//     }catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// }
