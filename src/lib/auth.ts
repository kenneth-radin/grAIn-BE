import jwt from "jsonwebtoken";
import User from "@/src/models/User";

export const getUserFromToken = async (req: Request) => {
  const auth = req.headers.get("authorization");

  if (!auth) throw new Error("No token");

  const token = auth.split(" ")[1];

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) throw new Error("User not found");

  return user;
};