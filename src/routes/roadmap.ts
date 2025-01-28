import { Router } from "express";
import protectRoute from "../middleware/auth";
// import {roadmap, getAllRoadmap } from "../controllers/Testroudmap.controller"

const router = Router();

// router.post("/generate-roadmap", protectRoute(), roadmap);
// router.post("/roadmaps", protectRoute, getAllRoadmap);
export default router;