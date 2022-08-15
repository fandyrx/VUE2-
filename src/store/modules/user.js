import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import {
  resetRouter,
  anyRoutes,
  asyncRoutes,
 
  constantRoutes,
  
} from "@/router";
import router from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routes: [],
    roles: [],
    buttons: [],
    //项目已有异步路由，与服务器返回标记信息对比，最终需要展示的路由
    resultAsyncRoutes: [],
    resultAllRoutes: [],
  };
};

const state = getDefaultState();

const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      //数组中没有这个元素返回 -1  不等于-1 则代表存在这个元素 ，真的值会返回filter 形成新数组
      //递归:2.3.4.5...级别路由
      if (item.children && item.children.length) {
        // 如果异步路由有二级路由，且二级数组有元素 将子路由与服务器返回路由对比
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  //对比路由信息
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes;
    //计算出所有展示路由
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    );
    //添加新的路由
    
    console.log(state.resultAllRoutes);

    router.addRoutes(state.resultAllRoutes);
  },
};

const actions = {
  // user login
 async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result =  await  login({ username: username.trim(), password: password }) 
   
    if(result.code === 20000){
      const { data } =  result;
      
      commit("SET_TOKEN", data.token);
      setToken(data.token);
      return "ok"
    }else{
      return Promise.reject( new Error('登录失败'))
    }   
   },
  

  // get user info
  async getInfo({ commit, state }) {

      let response = await getInfo(state.token)
      const { data } = response;
    
      if(data){
        commit("SET_USERINFO", data);
        commit(
          "SET_RESULTASYNCROUTES",
          computedAsyncRoutes(asyncRoutes, data.routes)
        );
      } else{
        return Promise.reject( new Error("Verification failed, please Login again."));
      }
  },

  // user logout
 async logout({ commit, state }) {
    let res = await logout(state.token)
    console.log(res);
    if(res.code == 20000) {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");

    }else {
      return Promise.reject(new Error ('error'))
    }
    
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
