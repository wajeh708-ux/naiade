import {useCallback, useEffect, useState} from 'react';
import {startScroll} from './lib/scroll';
import {useReducedMotion} from './hooks/useReducedMotion';
import {Nav} from './components/Nav';
import {Stage} from './components/Stage';
import {Closing} from './components/Closing';
import {Footer} from './components/Footer';
import {BagDrawer} from './components/BagDrawer';
import {Preloader} from './components/Preloader';

export default function App() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const onProgress = useCallback((p: number) => setProgress((cur) => Math.max(cur, p)), []);

  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <div id="top">
      <Preloader progress={progress} />
      <Nav />
      <main>
        <Stage onProgress={onProgress} />
        <Closing />
      </main>
      <Footer />
      <BagDrawer />
      <div className="grain" aria-hidden />
    </div>
  );
}
