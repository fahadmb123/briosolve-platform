import { Router } from "express";



const router = Router();



router.get("/login", (req, res) => {res.json({
    message: "This is Login Page",
  });
});


export default router;