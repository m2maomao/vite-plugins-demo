import type { Plugin } from 'vite';

export default function helloPlugin(): Plugin {
  return {
    name: 'hello-plugin',
    buildStart() {
      console.log('Hello, Vite Plugin!')
    },
    buildEnd() {
      console.log('Goodbye, Vite Plugin!')
    }
  }
}