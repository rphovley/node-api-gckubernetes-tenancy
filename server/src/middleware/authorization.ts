import { Request, Response, NextFunction } from './express'
import { CustomErrors } from '../utils/customErrors'
import { Roles } from '../models/app_user.model'

type IRoutePermissions = {
  [key: string]: Roles[]
}

const routePermissions: IRoutePermissions = {
  '/admin/app_users': ['speaker'],
}

function isAdmin(user): boolean {
  return user.roles.includes('admin')
}

// Validate that the user has the correct role/permissions for the requested resource
export const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // admins can access all resources
  if (!isAdmin(req.appUser)) {
    const sufficient = routePermissions[req.url].some(role => req.appUser.roles.includes(role))
    if (!sufficient) { next(new CustomErrors.PermissionDenied()) }
  }
  next()
}
