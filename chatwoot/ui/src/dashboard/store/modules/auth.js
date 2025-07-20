/* eslint no-param-reassign: 0 */
import axios from 'axios';
import Vue from 'vue';
import * as types from '../mutation-types';
import authAPI from '../../api/auth';
import createAxios from '../../helper/APIHelper';
import actionCable from '../../helper/actionCable';
import { setUser, getHeaderExpiry, clearCookiesOnLogout } from '../utils/api';
import { DEFAULT_REDIRECT_URL } from '../../constants';

const state = {
  currentUser: {
    id: null,
    account_id: null,
    channel: null,
    email: null,
    name: null,
    provider: null,
    uid: null,
    subscription: {
      state: null,
      expiry: null,
    },
  },
  currentAccountId: null,
};

// getters
export const getters = {
  isLoggedIn($state) {
    return !!$state.currentUser.id;
  },

  getCurrentUserID(_state) {
    return _state.currentUser.id;
  },

  getUISettings(_state) {
    return _state.currentUser.ui_settings || {};
  },

  getCurrentUserAvailabilityStatus(_state) {
    return _state.currentUser.availability_status;
  },

  getCurrentAccountId(_state) {
    return _state.currentAccountId;
  },

  getCurrentRole(_state) {
    const { accounts = [] } = _state.currentUser;
    const [currentAccount = {}] = accounts.filter(
      account => account.id === _state.currentAccountId
    );
    return currentAccount.role;
  },

  getCurrentUser(_state) {
    return _state.currentUser;
  },
};

// actions
export const actions = {
  login({ commit }, credentials) {
    return new Promise((resolve, reject) => {
      authAPI
        .login(credentials)
        .then(response => {
          console.log('--- Debug Login Process ---');
          console.log('1. Full response object:', response); // Log toàn bộ response
          console.log('2. Response headers object:', response.headers); // Log đối tượng headers

          const headers = response.headers;

          // Kiểm tra từng header trước khi lưu
          console.log('3. access-token from headers:', headers['access-token']);
          console.log('4. client from headers:', headers['client']);
          console.log('5. uid from headers:', headers['uid']);
          console.log('6. token-type from headers:', headers['token-type']);
          console.log('7. expiry from headers:', headers['expiry']);

          // Thực hiện lưu vào localStorage
          localStorage.setItem('access-token', headers['access-token']);
          localStorage.setItem('client', headers['client']);
          localStorage.setItem('uid', headers['uid']);
          localStorage.setItem('token-type', headers['token-type']);
          localStorage.setItem('expiry', headers['expiry']);

          console.log('8. Tokens saved to localStorage (after setItem calls):');
          console.log('   access-token:', localStorage.getItem('access-token'));
          console.log('   client:', localStorage.getItem('client'));
          console.log('   uid:', localStorage.getItem('uid'));
          console.log('   token-type:', localStorage.getItem('token-type'));
          console.log('   expiry:', localStorage.getItem('expiry'));

          // Kiểm tra xem setUser có nhận được dữ liệu đúng không
          console.log('9. Data for setUser:', response.data.data);
          setUser(response.data.data, headers['expiry']);

          commit(types.default.SET_CURRENT_USER);
          window.axios = createAxios(axios);
          actionCable.init(Vue);

          // TẠM THỜI: Thêm một độ trễ nhỏ trước khi chuyển hướng để đảm bảo localStorage ghi xong
          // Chỉ dùng để debug, sau khi debug xong thì xóa đi
          setTimeout(() => {
            window.location = DEFAULT_REDIRECT_URL;
            resolve();
          }, 500); // Độ trễ 500ms
        })
        .catch(error => {
          console.error('Login failed in UI:', error.response || error.message || error);
          reject(error);
        });
    });
  },
  async validityCheck(context) {
    try {
      const response = await authAPI.validityCheck();
      setUser(response.data.payload.data, getHeaderExpiry(response));
      context.commit(types.default.SET_CURRENT_USER);
    } catch (error) {
      if (error?.response?.status === 401) {
        clearCookiesOnLogout();
      }
    }
  },
  setUser({ commit, dispatch }) {
    if (authAPI.isLoggedIn()) {
      commit(types.default.SET_CURRENT_USER);
      dispatch('validityCheck');
    } else {
      commit(types.default.CLEAR_USER);
    }
  },
  logout({ commit }) {
    commit(types.default.CLEAR_USER);
  },

  updateProfile: async ({ commit }, params) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await authAPI.profileUpdate(params);
      setUser(response.data, getHeaderExpiry(response));
      commit(types.default.SET_CURRENT_USER);
    } catch (error) {
      throw error;
    }
  },

  updateUISettings: async ({ commit }, params) => {
    try {
      commit(types.default.SET_CURRENT_USER_UI_SETTINGS, params);
      const response = await authAPI.updateUISettings(params);
      setUser(response.data, getHeaderExpiry(response));
      commit(types.default.SET_CURRENT_USER);
    } catch (error) {
      // Ignore error
    }
  },

  updateAvailability: ({ commit, dispatch }, { availability }) => {
    authAPI.updateAvailability({ availability }).then(response => {
      const userData = response.data;
      const { id, availability_status: availabilityStatus } = userData;
      setUser(userData, getHeaderExpiry(response));
      commit(types.default.SET_CURRENT_USER);
      dispatch('agents/updatePresence', { [id]: availabilityStatus });
    });
  },

  setCurrentAccountId({ commit }, accountId) {
    commit(types.default.SET_CURRENT_ACCOUNT_ID, accountId);
  },

  setCurrentUserAvailabilityStatus({ commit, state: $state }, data) {
    if (data[$state.currentUser.id]) {
      commit(
        types.default.SET_CURRENT_USER_AVAILABILITY,
        data[$state.currentUser.id]
      );
    }
  },
};

// mutations
export const mutations = {
  [types.default.SET_CURRENT_USER_AVAILABILITY](_state, status) {
    Vue.set(_state.currentUser, 'availability_status', status);
  },
  [types.default.CLEAR_USER](_state) {
    _state.currentUser.id = null;
  },
  [types.default.SET_CURRENT_USER](_state) {
    const currentUser = {
      ...authAPI.getAuthData(),
      ...authAPI.getCurrentUser(),
    };

    Vue.set(_state, 'currentUser', currentUser);
  },
  [types.default.SET_CURRENT_USER_UI_SETTINGS](_state, { uiSettings }) {
    Vue.set(_state, 'currentUser', {
      ..._state.currentUser,
      ui_settings: {
        ..._state.currentUser.ui_settings,
        ...uiSettings,
      },
    });
  },
  [types.default.SET_CURRENT_ACCOUNT_ID](_state, accountId) {
    Vue.set(_state, 'currentAccountId', Number(accountId));
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
