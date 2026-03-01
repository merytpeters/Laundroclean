import asyncHandler from '../../../utils/asyncHandler.js';
import { RolesService } from '../index.js';

const createRole = asyncHandler(async (req, res) => {
  const role = await RolesService.createRole(req.body);
  res.status(201).json({
    success: true,
    data: { role },
    message: 'Role created successfully',
  });
});

const getRoles = asyncHandler(async (req, res) => {
  const roles = await RolesService.getAllRoles();
  res.json({ success: true, data: { roles } });
});

const getRole = asyncHandler(async (req, res) => {
  const role = await RolesService.getRoleById(req.params.id);
  if (!role) {
    return res.status(404).json({ success: false, message: 'Role not found' });
  }
  res.json({ success: true, data: { role } });
});

const updateRole = asyncHandler(async (req, res) => {
  const role = await RolesService.updateRole(req.params.id, req.body);
  res.json({ success: true, data: { role }, message: 'Role updated successfully' });
});

const deleteRole = asyncHandler(async (req, res) => {
  await RolesService.deleteRole(req.params.id);
  res.json({ success: true, message: 'Role deleted successfully' });
});

export default {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
