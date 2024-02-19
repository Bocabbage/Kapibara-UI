import { Layout, Menu } from 'antd'

const { Header, Content, Footer } = Layout
const MenuName: string[] = ["Active", "Inactive"]
const MenuItem = new Array(2).fill(null).map((_, index) => ({
  key: index + 1,
  label: `${MenuName[index]}`
}))

export default function Mikanani() {
    return <>
      <title>Mikanani</title>
      <div className="h-full w-full min-h-full">
      <Layout style={{ height: '100%' }}>
        <Header>
          <Menu mode="horizontal" items={MenuItem}/>
        </Header>
        <Content style={{ height: '60%', minHeight: '60%', padding: '0 0px' }}>
          <div className="min-h-full bg-orange-100"></div>
        </Content>
        <Footer>Bocabbage</Footer>
      </Layout>
      </div>
    </>
}