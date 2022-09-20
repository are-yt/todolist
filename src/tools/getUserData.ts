export const getUserData = (key = 'todolist'): any => {
  const user_data = utools.dbStorage.getItem(key)
  if (!user_data) {
    return false
  }
  return JSON.parse(user_data)
}
