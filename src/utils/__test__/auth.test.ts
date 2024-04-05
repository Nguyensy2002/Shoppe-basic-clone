import { describe, expect, it, beforeEach } from "vitest"
import { clearLS, getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from "../auth"

const refresh_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWQwYmI2NGY2NjgwMDNlMGM1YWJjMSIsImVtYWlsIjoiZW1uaGVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0wNFQxODoxODoyNC4xMjZaIiwiaWF0IjoxNjk2NDQzNTA0LCJleHAiOjE3MTAyNjc1MDR9.q_jG4kMEpSS6BeA30mIMFYo57rlHhg0DReDhYRAiE1M'
const access_token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWQwYmI2NGY2NjgwMDNlMGM1YWJjMSIsImVtYWlsIjoiZW1uaGVAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0wNFQxODoxODoyNC4xMjZaIiwiaWF0IjoxNjk2NDQzNTA0LCJleHAiOjE2OTY1Mjk5MDR9.6_7e9x1s4RBEfN8haUmE3CRR97i3CANYc8_AxCURtk4'
const profile = '{"_id":"651d0bb64f668003e0c5abc1","roles":["User"],"email":"emnhe@gmail.com","createdAt":"2023-10-04T06:52:38.132Z","updatedAt":"2023-10-04T08:07:32.405Z","__v":0,"address":"nghe an","avatar":"853c40da-3619-4db9-b68b-bec7d65e2c00.jpg","date_of_birth":"2002-08-13T17:00:00.000Z","name":"Nguyễn Quốc Sỹ","phone":"0964168636"}'

beforeEach(() => {
    localStorage.clear()
  })
  
  describe('access_token', () => {
    it('access_token được set vào localStorage', () => {
      setAccessTokenToLS(access_token)
      expect(getAccessTokenFromLS()).toBe(access_token)
    })
  })
  
  describe('refresh_token', () => {
    it('refresh_token được set vào localStorage', () => {
      setRefreshTokenToLS(refresh_token)
      expect(getRefreshTokenFromLS()).toEqual(refresh_token)
    })
  })
  
  describe('clearLS', () => {
    it('Xóa hết access_token, refresh_token, profile', () => {
      setRefreshTokenToLS(refresh_token)
      setAccessTokenToLS(access_token)
      // setProfile tại đây
      // ...
      clearLS()
      expect(getAccessTokenFromLS()).toBe('')
      expect(getRefreshTokenFromLS()).toBe('')
    })
  })