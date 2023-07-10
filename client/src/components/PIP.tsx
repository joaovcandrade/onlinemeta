import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';

const PIP = ({ username }) => {
  const url = `https://meet.unifil.tech/metaverso-1#userInfo.displayName="${encodeURIComponent(username)}"&config.toolbarButtons=["microphone","raisehand","invite","download"]&config.startAudioOnly=true&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.faceLandmarks.enableFaceCentering=false&config.disableTileEnlargement=true&config.notifications=[]`;
  const [expanded, setExpanded] = useState(false);
  const [width, setWidth] = useState(350);
  const [height, setHeight] = useState(250);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMessage, setShowMessage] = useState(false); // Alterado para false inicialmente

  const iframeRef = useRef(null); // Referência para o elemento iframe

  const togglePIPMode = () => {
    setExpanded(!expanded);
    if (expanded) {
      setPosition({ x: position.x, y: position.y });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleResize = (e, direction, ref, delta, position) => {
    const { offsetWidth, offsetHeight } = ref;
    setWidth(offsetWidth);
    setHeight(offsetHeight);
  };

  const handleDragStop = (e, data) => {
    const { x, y } = data;
    const { innerWidth, innerHeight } = window;
    const maxWidth = innerWidth - width;
    const maxHeight = innerHeight - height;

    const boundedX = Math.max(0, Math.min(x, maxWidth));
    const boundedY = Math.max(0, Math.min(y, maxHeight));

    setPosition({ x: boundedX, y: boundedY });
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const { innerWidth } = window;
      const maxWidth = innerWidth - width;

      if (position.x > maxWidth) {
        setPosition({ x: maxWidth, y: position.y });
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [width, position]);

  useEffect(() => {
    const iframe = iframeRef.current; // Obtém a referência do elemento iframe
    const checkElement = () => {
      if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const targetElement = iframeDocument.querySelector('.css-1gaf67c-footer'); // Substitua 'meuElemento' pelo ID do elemento que deseja verificar

        if (targetElement) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
      }
    };

    checkElement();

    // Adiciona um intervalo para verificar periodicamente a presença do elemento no iframe
    const intervalId = setInterval(checkElement, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleButtonClick = () => {
    togglePIPMode();
  };

  const handleMessageClose = () => {
    setShowMessage(false);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      border: '1px solid gray',
      borderRadius: '10px',
      overflow: 'hidden',
      zIndex: 9999,
      backgroundColor: 'white',
      flexDirection: 'column-reverse',
      cursor: 'move',
    },
    iframe: {
      width: expanded ? '100%' : '100%',
      height: expanded ? '100%' : '100%',
      pointerEvents: "none",
    },
    dragHandle: {
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      height: '40px',
      width: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '5px',
      userSelect: 'none',
    },
    button: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
    },
    message: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      fontSize: '20px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
    },
  };

  return (
    <Rnd
      style={styles.container}
      size={{
        width: expanded ? '100%' : `${width}px`,
        height: expanded ? '100%' : `${height}px`,
      }}
      position={position}
      minWidth={200}
      minHeight={100}
      dragHandleClassName="drag-handle"
      onResize={handleResize}
      onDragStop={handleDragStop}
      enableResizing={!expanded}
    >
      <iframe
        title="Picture-in-Picture"
        id="meet"
        src={url}
        style={styles.iframe}
        scrolling="no"
        allow="microphone;"
        tabIndex='-1'
              />
      {showMessage && (
        <div style={styles.message}>
          <p>Element is present in the iframe</p>
          <span
            style={styles.closeButton}
            onClick={handleMessageClose}
            title="Close"
            
          >
            &times;
          </span>
        </div>
      )}
      <div className="drag-handle" style={styles.dragHandle}>
        <button style={styles.button} onClick={handleButtonClick}>
          {expanded ? 'Minimizar' : 'Expandir'}
        </button>
      </div>
    </Rnd>
  );
};

export default PIP;
