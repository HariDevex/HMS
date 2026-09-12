import { db } from '../db/sqliteClient.js';

export const login = (req, res) => {
  const { email, role } = req.body;
  const user = db.users.find((u) => u.email === email || (role && u.role === role))[0] || db.users.find((u) => u.role === (role || 'doctor'))[0];

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
  }

  return res.json({
    success: true,
    token: `hms_jwt_token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
    },
  });
};

export const getCurrentUser = (req, res) => {
  const userId = req.headers['x-user-id'] || 'USR-002';
  const user = db.users.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, user });
};

export const getUsers = (req, res) => {
  const { role } = req.query;
  const users = role ? db.users.find((u) => u.role === role) : db.users.find();
  return res.json({ success: true, count: users.length, users });
};

export const createUser = (req, res) => {
  const { name, email, role, department } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
  }
  const newUser = db.users.create({
    id: `USR-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    role,
    department: department || 'General Clinical',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    isActive: true,
  });
  return res.status(201).json({ success: true, user: newUser });
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const updated = db.users.update(id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, user: updated });
};
