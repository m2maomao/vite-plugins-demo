import { http } from '../utils/request';

export default {
  login(data: {username: string; password: string}) {
    return http.post('/user/login', data);
  },

  getProfile(id: number) {
    return http.get(`/user/${id}`)
  }
}