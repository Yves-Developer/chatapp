export const viewMessage = async (req, res) => {
  return res.status(200).json({ userId: req.userId });
};
