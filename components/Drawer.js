import { useRef, useState } from 'react';

const translateY = {
    large: 'translate-y-60', // 15rem, 240px
    medium: 'translate-y-48', // 12rem, 192px
    small: 'translate-y-36', // 6rem, 96px
}

export default function Drawer({ children, position, heading, size }) {
    const [panelState, setPanelState] = useState(false);

    const panelRef = useRef(null);

    function handleClick(e) {
        console.log('====> handleClick');
        setPanelState(!panelState);
    }

    if (position === 'top') {
        return (<>
            <div ref={panelRef} onClick={handleClick} className={`
            ${panelState ? '-' + translateY[size] : 'translate-y-0'} 
            transition-all 
            duration-500 
            translate-y
            fixed 
            z-10
            top-0 left-0 
            w-screen bg-slate-500 
            border-t border-white
            `}>
                {children}
                <div className="flex items-center justify-center pt-1 pb-1 bg-slate-400 border-b border-white">
                    <h2 className="ml-2">{heading}</h2>
                </div>

            </div>
        </>
        )

    }

    else {
        return (<>
            <div ref={panelRef} onClick={handleClick} className={`
            ${panelState ? translateY[size] : 'translate-y-0'} 
            transition-all 
            duration-500 
            translate-y
            fixed 
            bottom-0 left-0 
            w-screen bg-slate-500 
            border-t border-white
            `}>
                <div className="flex items-center justify-center pt-1 pb-1 bg-slate-400 border-b border-white">
                    <h2 className="ml-2">{heading}</h2>
                </div>

                {children}
            </div>
        </>
        )

    }
}
