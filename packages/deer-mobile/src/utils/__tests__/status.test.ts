import { describe, it, expect } from 'vitest';
import {
  getStatusMsg,
  isSuccessStatus,
  isWarningStatus,
  isAuthError,
  isTokenExpired,
  HTTP_STATUS,
  AUTH_ERROR_STATUS,
  DEFAULT_ERROR_MSG,
} from '../status';

describe('getStatusMsg', () => {
  it('应返回已知 HTTP 状态码的中文提示', () => {
    expect(getStatusMsg(400)).toBe('请求参数错误');
    expect(getStatusMsg(401)).toBe('未授权，请重新登录');
    expect(getStatusMsg(403)).toBe('拒绝访问');
    expect(getStatusMsg(404)).toBe('请求地址不存在');
    expect(getStatusMsg(500)).toBe('服务器内部错误');
    expect(getStatusMsg(502)).toBe('网关错误');
    expect(getStatusMsg(503)).toBe('服务暂不可用');
    expect(getStatusMsg(504)).toBe('网关超时');
  });

  it('应返回授权异常状态码的提示', () => {
    expect(getStatusMsg(110)).toBe('授权异常');
    expect(getStatusMsg(112)).toBe('授权异常');
    expect(getStatusMsg(205)).toBe('身份验证失败，请重新登录');
    expect(getStatusMsg(209)).toBe('身份验证失败，请重新登录');
    expect(getStatusMsg(712)).toBe('身份验证失败，请重新登录');
  });

  it('未知状态码应返回兜底提示', () => {
    expect(getStatusMsg(999)).toBe(DEFAULT_ERROR_MSG);
    expect(getStatusMsg(-1)).toBe(DEFAULT_ERROR_MSG);
  });

  it('应支持字符串格式的状态码', () => {
    expect(getStatusMsg('400')).toBe('请求参数错误');
    expect(getStatusMsg('999')).toBe(DEFAULT_ERROR_MSG);
  });
});

describe('isSuccessStatus', () => {
  it('1xx 状态码应返回 true', () => {
    expect(isSuccessStatus(100)).toBe(true);
    expect(isSuccessStatus(101)).toBe(true);
    expect(isSuccessStatus(110)).toBe(true);
    expect(isSuccessStatus(199)).toBe(true);
  });

  it('非 1xx 状态码应返回 false', () => {
    expect(isSuccessStatus(200)).toBe(false);
    expect(isSuccessStatus(400)).toBe(false);
    expect(isSuccessStatus(500)).toBe(false);
    expect(isSuccessStatus(712)).toBe(false);
  });

  it('应支持字符串格式', () => {
    expect(isSuccessStatus('100')).toBe(true);
    expect(isSuccessStatus('200')).toBe(false);
  });
});

describe('isWarningStatus', () => {
  it('2xx 状态码应返回 true', () => {
    expect(isWarningStatus(200)).toBe(true);
    expect(isWarningStatus(201)).toBe(true);
    expect(isWarningStatus(299)).toBe(true);
  });

  it('非 2xx 状态码应返回 false', () => {
    expect(isWarningStatus(100)).toBe(false);
    expect(isWarningStatus(400)).toBe(false);
    expect(isWarningStatus(712)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('授权异常状态码应返回 true', () => {
    expect(isAuthError(110)).toBe(true);
    expect(isAuthError(112)).toBe(true);
    expect(isAuthError(205)).toBe(true);
    expect(isAuthError(209)).toBe(true);
    expect(isAuthError(712)).toBe(true);
  });

  it('非授权异常状态码应返回 false', () => {
    expect(isAuthError(100)).toBe(false);
    expect(isAuthError(400)).toBe(false);
    expect(isAuthError(500)).toBe(false);
  });

  it('应支持字符串格式', () => {
    expect(isAuthError('110')).toBe(true);
    expect(isAuthError('400')).toBe(false);
  });
});

describe('isTokenExpired', () => {
  it('Token 过期状态码应返回 true', () => {
    expect(isTokenExpired(110)).toBe(true);
    expect(isTokenExpired(112)).toBe(true);
  });

  it('非 Token 过期状态码应返回 false', () => {
    expect(isTokenExpired(205)).toBe(false);
    expect(isTokenExpired(209)).toBe(false);
    expect(isTokenExpired(712)).toBe(false);
    expect(isTokenExpired(400)).toBe(false);
  });
});

describe('常量定义', () => {
  it('HTTP_STATUS 应包含所有预期的键', () => {
    const expectedKeys = [400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 414, 415, 429, 500, 502, 503, 504];
    expectedKeys.forEach((key) => {
      expect(HTTP_STATUS).toHaveProperty(String(key));
    });
  });

  it('AUTH_ERROR_STATUS 应包含所有授权异常状态码', () => {
    expect(AUTH_ERROR_STATUS).toHaveProperty('110');
    expect(AUTH_ERROR_STATUS).toHaveProperty('112');
    expect(AUTH_ERROR_STATUS).toHaveProperty('205');
    expect(AUTH_ERROR_STATUS).toHaveProperty('209');
    expect(AUTH_ERROR_STATUS).toHaveProperty('712');
  });

  it('DEFAULT_ERROR_MSG 应有兜底值', () => {
    expect(DEFAULT_ERROR_MSG).toBe('系统服务异常，请联系维护人员');
  });
});
