import { AppstoreOutlined, DesktopOutlined, MailOutlined, TableOutlined } from '@ant-design/icons'
import React, { lazy } from 'react'
import { Link, Navigate } from 'react-router-dom'

import AdminLayout from '../components/Layout'
// import LoginPage from '@/pages/login'

// import { checkAuth } from './auth'
// import { NotAuth, NotFound } from './exception'
import { BreadcrumbMap, MenuItem, MenuRoute, RoutesType } from './interface'

// https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting
// home
const Mediarecorder = lazy(() => import('../pages/mediaRecorder'))
const Dashboard = lazy(() => import('../pages/dashboard'))
const Login = lazy(() => import('../pages/Login'))

// table
// const TablePro = lazy(() => import('@/pages/table/table-pro'))
// const TableAntd = lazy(() => import('@/pages/table/table-antd'))
// const TableAhook = lazy(() => import('@/pages/table/table-ahook'))
// playground
// const Playground = lazy(() => import('@/pages/playground'))
// product
// const Phone = lazy(() => import('@/pages/product/phone'))
// const Gold = lazy(() => import('@/pages/product/luxury/gold'))

const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    element: <AdminLayout />, // layout应该不需要lazyload 后续考虑SSR?
    children: [
      {
        name: '首页',
        path: '/home',
        icon: <DesktopOutlined />,
        element: <Dashboard />
      },
      {
        name: '屏幕录制',
        path: '/mediaRecorder',
        element: <Mediarecorder />
      },
      {
        name: 'Vue',
        path: '/vue',
        children: [
          {
            name: '子应用1',
            path: '/vue/app1',
            icon: <TableOutlined />,
            element: <Dashboard />
          },
        ],
      },
    ]
  },
  {
    name: '登录',
    path: '/login',
    icon: <DesktopOutlined />,
    element: <Login />
  },
  // {
  //   path: '*',
  //   element: <NotFound />
  // }
]

// extract MenuItems for antd Menu
// extract breadcrumbNameMap for antd Breadcrumb
const extractMenuItems = (menuRoutes: MenuRoute[] = []) => {
  const breadcrumbNameMap: BreadcrumbMap<MenuRoute> = {}

  const recurExtractMenuItems = (menuRoutes: MenuRoute[], menuItems: MenuItem[]) => {
    if (menuRoutes?.length) {
      menuRoutes.forEach((item: MenuRoute) => {
        const { name, path, icon, hideInMenu, children } = item
        breadcrumbNameMap[path] = name as string
        if (!hideInMenu) {
          menuItems.push({
            key: path,
            icon: icon,
            label: children?.length ? name : <Link to={path}>{name}</Link>,
            ...(children?.length
              ? {
                  children: recurExtractMenuItems(children, [])
                }
              : {})
          })
        }
      })
    }
    return menuItems
  }
  const menuItems = recurExtractMenuItems(menuRoutes, [])
  return { menuItems, breadcrumbNameMap }
}

// extract routes for react-router-dom6
const extractRoutes = (menuRoutes: MenuRoute[]) => {
  const recurExtractRoutes = (menuRoutes: MenuRoute[], routes: RoutesType[]) => {
    if (menuRoutes?.length) {
      menuRoutes.forEach((item: MenuRoute) => {
        const { path, auth, element, loader, children } = item
        routes.push({
          // index,
          loader,
          path,
          element: element,
          ...(children?.length
            ? {
                children: recurExtractRoutes(children, [])
              }
            : {})
        })
      })
    }
    return routes
  }
  return recurExtractRoutes(menuRoutes, [])
}

const { menuItems, breadcrumbNameMap } = extractMenuItems(menuRoutes[0]?.children)
console.log('menuItems', menuItems, 'breadcrumbNameMap', breadcrumbNameMap)
const routes = extractRoutes(menuRoutes)
console.log('routes', routes)

export { breadcrumbNameMap, menuItems, routes }