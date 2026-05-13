import { Request, Response } from 'express';
import User from '../models/user.models';
import { fileLogger } from '../utils/fileLogger';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    fileLogger.error('getAllUsers error', {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      params: req.params,
      query: req.query,
      body: req.body,
    });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};