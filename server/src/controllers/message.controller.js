export const viewMessage = async (req, res) => {
  return res.status(200).json({ message: "View message", userId: req.userId });
};
