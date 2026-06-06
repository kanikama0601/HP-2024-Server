from ..utils.constant import *

def checkPermission(request_user, organization_id, permission_type):
  
  # Superusers bypass all permission checks
  if request_user.is_superuser:
    return True

  for permission in permission_type:
    
    if permission == PERMISSION_ADMIN:
      
      # Admin check is global, does not require organization_id
      if request_user.permissions.filter(permission_type=permission).exists():
        
        return True
    
    elif permission == PERMISSION_INVITE_USER:
      
      if request_user.permissions.filter(permission_type=permission, organization_id=organization_id).exists():
        
        return True
    
    else:
      # For other permissions (including inspection), they are tied to a specific organization.
      # If organization_id is None, they cannot check these specific permissions.
      if organization_id is None:
          continue

      if request_user.permissions.filter(permission_type=permission, organization_id=organization_id).exists() and request_user.organization.filter(id=organization_id, organization_permissions__permission_type=permission).exists():
        
        return True
  
  return False
