const HOST = process.env.REACT_APP_API ;
const PORT = process.env.REACT_APP_PORT ;
export const API =
  `http://186.12.145.198:4000`;

export const ROUTES_RELATIVE = {
    course: {
      commission: `${API}/course`,
      downloadCommission: `${API}/course/download-template`,
      uploadCommission: `${API}/course/upload`,
      courseSector: `${API}/course/sector`,
    },
    image: {
      image: `${API}/image`,
      excelToJson: `${API}/image/excel-to-json`,
      planeViewQr: `${API}/image/qr/plane/view`,
    },
    advertising: {
      advertising: `${API}/advertising`,
      advertisingScreen: `${API}/advertising/screen`,
    },
    screen: {
      getAll: '/screen',
      update: '/screen'
    },
    sector: {
      getSectors: `${API}/sector`
    },
    user: {
      users: `${API}/user`,
      createUser: `${API}/auth/register`
    },
    auth: {
      login: `${API}/auth/login`,
      refreshToken: `${API}/auth/refresh-token`
    }
}
