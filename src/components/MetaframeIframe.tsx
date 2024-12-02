import React, {
  ComponentType,
  useEffect,
  useRef,
} from 'react';

import { MetapageIFrameRpcClient } from '@metapages/metapage';

export type MetaframeIframeStyleProps = {
  style?: React.CSSProperties;
  styleWrapper?: React.CSSProperties;
  className?: string;
  classNameWrapper?: string;
}

export const MetaframeIframe: React.FC<{
  metaframe?: MetapageIFrameRpcClient;
  Wrapper?: ComponentType<any>;
} & MetaframeIframeStyleProps> = ({ metaframe, Wrapper, style={}, styleWrapper={}, className, classNameWrapper }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!metaframe) {
      return;
    }
    if (metaframe.isDisposed()) {
      return;
    }

    // the iframe is delivered asynchronously
    (async () => {
      if (metaframe.isDisposed()) {
        return;
      }

      if (cancelled) {
        return;
      }
      const iframe = await metaframe.iframe;
      if (metaframe.isDisposed()) {
        return;
      }
      if (cancelled) {
        return;
      }
      if (!ref?.current) {
        return;
      }

      if (!ref.current.firstChild || ref.current.firstChild !== iframe) {
        const child: ChildNode | null = ref.current.firstChild;
        if (child) {
          ref.current.removeChild(child);
        }
        className?.split(" ").forEach((c) => iframe.classList.add(c));
        
        if (!className) {
          // https://stackoverflow.com/questions/18765762/how-to-make-width-and-height-of-iframe-same-as-its-parent-div
          iframe.style.cssText = `overflow:clip;width:100%;height:100%`;
        }

        ref.current.appendChild(iframe);
      }
    })();

    return () => {
      cancelled = true;
      while (ref?.current?.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
    };
  }, [metaframe, ref]);

  if (!metaframe) {
    return <p>Missing metaframe</p>;
  }

  if (Wrapper) {
    return (
      <Wrapper ref={ref} key={metaframe.id}  />
    );
  } else {
    return (
      <div ref={ref} className={classNameWrapper} key={metaframe.id} style={{ ...style, }}></div>
    );
  }
};
