
import ThreeTest from './components/ThreeTest.vue'
import Home from './components/Home.vue'
import Breakout from './components/Breakout.vue'
import TexturedFloor from './components/TexturedFloor.vue'
import Map from './components/Map.vue'
import DragControls from './components/DragControls.vue'
import SpriteFight from './components/SpriteFight.vue'
import TwinStick from './components/TwinStick.vue'


export const routes = [
  { path: '/', component: Home },
  { path: '/three-test', component: ThreeTest },
  { path: '/breakout', component: Breakout },
  { path: '/textured-floor', component: TexturedFloor },
  { path: '/map', component: Map },
  { path: '/drag-controls', component: DragControls },
  { path: '/sprite-fight', component: SpriteFight },
  { path: '/twin-stick', component: TwinStick },
]
