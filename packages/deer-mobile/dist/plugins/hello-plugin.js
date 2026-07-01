export default function helloPlugin() {
    return {
        name: 'hello-plugin',
        buildStart() {
            console.log('Hello, Vite Plugin!');
        },
        buildEnd() {
            console.log('Goodbye, Vite Plugin!');
        }
    };
}
