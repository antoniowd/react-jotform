import React, { CSSProperties, useEffect, useRef } from "react";

interface DefaultValues {
  [key: string]: string | boolean | number;
}

export interface JotformProps {
  src: string;
  defaults?: DefaultValues;
  title?: string;
  className?: string | undefined;
  style?: CSSProperties;
  scrolling?: boolean;
}

const createSource = (src: string, defaults?: DefaultValues): string => {
  const url = new URL(src);

  if (defaults) {
    for (let key of Object.keys(defaults)) {
      url.searchParams.set(key, defaults[key].toString());
    }
  }

  url.searchParams.set("isIframeEmbed", "1");
  return url.toString();
};

const isPermitted = (originUrl: string, whitelisted_domains: string[]) => {
  var url = document.createElement("a");
  url.href = originUrl;
  var hostname = url.hostname;
  var result = false;
  if (typeof hostname !== "undefined") {
    whitelisted_domains.forEach(function (element) {
      if (
        hostname.slice(-1 * element.length - 1) === ".".concat(element) ||
        hostname === element
      ) {
        result = true;
      }
    });
    return result;
  }
  return false;
};


const Jotform: React.FC<JotformProps> = ({
  src,
  defaults,
  title,
  scrolling = false,
  className,
  style = {
    minWidth: "100%",
    height: "539px",
    border: "none",
  },
}) => {

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeMessage = (event: MessageEvent<string>) => {
    if (typeof event.data === "object") {
      return;
    }

    const args = event.data.split(":");
    if (args.length > 2) {
      const iframe = iframeRef.current;
      if (!iframe) {
        return;
      }

      switch (args[0]) {
        case "scrollIntoView":
          iframe.scrollIntoView();
          break;
        case "setHeight":
          iframe.style.height = args[1] + "px";
          break;
        case "collapseErrorPage":
          if (iframe.clientHeight > window.innerHeight) {
            iframe.style.height = window.innerHeight + "px";
          }
          break;
        case "reloadPage":
          window.location.reload();
          break;
        case "loadScript":
          if (!isPermitted(event.origin, ["jotform.com", "jotform.pro"])) {
            break;
          }
          let source = args[1];
          if (args.length > 3) {
            source = args[1] + ":" + args[2];
          }
          const script = document.createElement("script");
          script.src = source;
          script.type = "text/javascript";
          document.body.appendChild(script);
          break;
        case "exitFullscreen":
          if (window.document.exitFullscreen) {
            window.document.exitFullscreen();
          }
          // @ts-ignore
          else if (window.document.mozCancelFullScreen) {
            // @ts-ignore
            window.document.mozCancelFullScreen();
          }
          // @ts-ignore
          else if (window.document.mozCancelFullscreen) {
            // @ts-ignore
            window.document.mozCancelFullScreen();
          }
          // @ts-ignore
          else if (window.document.webkitExitFullscreen) {
            // @ts-ignore
            window.document.webkitExitFullscreen();
          }
          // @ts-ignore
          else if (window.document.msExitFullscreen) {
            // @ts-ignore
            window.document.msExitFullscreen();
          }
          break;
      }

      const isJotform = event.origin.indexOf("jotform") > -1;
      if (isJotform && iframe.contentWindow?.postMessage) {
        let urls = {
          docurl: encodeURIComponent(document.URL),
          referrer: encodeURIComponent(document.referrer),
        };

        iframe.contentWindow.postMessage(
          JSON.stringify({ type: "urls", value: urls }),
          "*"
        );
      }
    }
  };

  useEffect(() => {
    if (window) {
      window.parent.scrollTo(0, 0);
      if (window.addEventListener) {
        window.addEventListener("message", handleIframeMessage, false);
      }
      // @ts-ignore
      else if (window.attachEvent) {
        // @ts-ignore
        window.attachEvent("onmessage", handleIFrameMessage);
      }
    }

    return () => {
      if (window) {
        window.parent.scrollTo(0, 0);
        if (window.removeEventListener) {
          window.removeEventListener("message", handleIframeMessage);
        }
        // @ts-ignore
        else if (window.detachEvent) {
          // @ts-ignore
          window.detachEvent("onmessage", handleIFrameMessage);
        }
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      // @ts-ignore
      allowtransparency="true"
      allowFullScreen
      allow="geolocation; microphone; camera"
      src={createSource(src, defaults)}
      frameBorder="0"
      className={className}
      style={style}
      scrolling={scrolling ? "yes" : "no"}
    />
  );
};

export default Jotform;
