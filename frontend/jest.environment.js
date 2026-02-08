import JSDOMEnvironment from 'jest-environment-jsdom';

class CustomEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    
    // Make window.location writable so tests can mock it
    if (this.global.window) {
      delete this.global.window.location;
      this.global.window.location = {
        reload: () => {},
        href: 'http://localhost/',
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
      };
    }
  }
}

export default CustomEnvironment;
