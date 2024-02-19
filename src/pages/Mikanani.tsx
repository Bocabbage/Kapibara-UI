import { Layout, Menu, ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const MenuName: string[] = ["Active", "Inactive"]
const MenuItem = new Array(2).fill(null).map((_, index) => ({
  key: index + 1,
  label: `${MenuName[index]}`
}))

// TODO: Get data from API. Current local mock data
const AnimeList = [
  {
    name: "AnimeName1",
    isActive: true,
  },
  {
    name: "AnimeName2",
    isActive: false,
  },
  {
    name: "AnimeName3",
    isActive: true,
  },
]

export default function Mikanani() {
    // TODO: [Enhancement] All config together
    return <>
      <ConfigProvider
        theme={{
          token: {
            // fontFamily: 'Oswald-Bold',
          },
          components: {
            Layout: {
              bodyBg: '#f0fdf4',
              headerBg: '#d1fae5',
              footerBg: '#d1fae5',
            },
            Menu: {
              itemBg: '#d1fae5',
              horizontalItemSelectedColor: '#065f46',
              fontFamily: 'Oswald-Bold',
            },
          },
        }}
      >
        <title>Mikanani</title>
        <div className="h-full w-full min-h-full rounded-lg">
        <Layout style={{ height: '100%', width: '100%' }}>
          <Header>
            <Menu mode="horizontal" items={MenuItem}/>
          </Header>
          <Content style={{ width: '100%', minWidth: '90%', height: '90%', minHeight: '60%', padding: '15px' }}>
            <div className="min-h-full bg-emerald-100 rounded-lg flex flex-col">
              {AnimeList.map((item, index) => 
                <div className="font-oswald-regular" key={index}>{item.name}</div>
              )}
            </div>
          </Content>
          <Footer style={{ width: '100%', height: '5%', minHeight: '5%' }}>Bocabbage</Footer>
        </Layout>
        </div>
      </ConfigProvider>
    </>
}