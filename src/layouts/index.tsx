import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return () => (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <header style={{ padding: '16px', background: '#722ed1', color: '#fff'}}>
          <h2 style={{ margin: 0}}>My Framework</h2>
        </header>
        <main style={{ flex: 1, padding: '24px'}}>
          <router-view />
        </main>
        <footer style={{ padding: '12px', textAlign: 'center', color: '#999'}}>
          © 2026 My Framework Demo
        </footer>
      </div>
    )
  }
})