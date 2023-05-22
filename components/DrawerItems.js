import React, { useState } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Drawer from './Drawer';
import ContinentSelector from './ContinentSelector';
import CountryMap from './CountryMap';

export default function DrawerItems({ children, headings = [], position = 'top' }) {
    const [drawerState, setDrawerState] = useState([false, false, false, false]);
    const bgColors = ['bg-purple-400', 'bg-purple-500', 'bg-purple-600'];

    const drawers = children.map(child => child.props.header);

    // Receive notification from Drawer.
    function hortonHearsAWho(data) {
        const _drawerState = drawerState.slice(0);
        for (let s in _drawerState) { _drawerState[s] = false; }
        setDrawerState(_drawerState);
    }

    // Clone child component. This is so a component can be put in a drawer without having to alter it directly.
    function cloneComponent(child) {
        return React.cloneElement(child, { hortonHearsAWho });
        return child;
    }

    function handleClick(e) {
        const el = e.currentTarget;
        const { drawer } = el.dataset;
        const _drawerState = drawerState.slice(0);
        for (let s in _drawerState) { if (s !== drawer) _drawerState[s] = false; }
        _drawerState[drawer] = !_drawerState[drawer];
        setDrawerState(_drawerState);
    }


    return (<div id="drawerWrapper" className="relative z-0">
        {/* Draw drawers */}
        <div className="z-20 flex justify-evenly w-full fixed top-0 left-0">
            {drawers.map((d, key) => {
                const bg = bgColors[key];
                return <div data-drawer={key} key={key} onClick={handleClick} className={`${bg} flex-1 cursor-pointer text-center bg-purple- p-1 text-white`}>{d}</div>
            })}
        </div>

        {/* Draw drawer contents */}
        {children.map((child, ndx) => {
            return (<div key={ndx} className={`${drawerState[ndx] ? 'translate-y-0' : '-translate-y-60'} z-0 h-60 w-full fixed top-8 left-0 duration-500 bg-slate-600 border border-white`}>
                {cloneComponent(child)}
            </div>)
        })}

    </div>
    )
}
