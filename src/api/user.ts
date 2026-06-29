export default ({ $get, $post }) => ({
  login(data: {username: string; password: string}) {
    return $post('/user/login', data);
  },

  getProfile(id: number) {
    return $get(`/user/${id}`)
  }
})