import { useState } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Drawer from './Drawer';
import ContinentSelector from './ContinentSelector';
import CountryMap from './CountryMap';

export default function DrawerItems({ children, headings = [], position = 'top' }) {
    const [drawerState, setDrawerState] = useState([false, false, false, false]);

    const drawers = children.map(child => child.props.header);

    function handleClick(e) {
        const el = e.currentTarget;
        const { drawer } = el.dataset;
        const _drawerState = drawerState.slice(0);
        for (let s in _drawerState) { if (s !== drawer) _drawerState[s] = false; }
        _drawerState[drawer] = !_drawerState[drawer];
        setDrawerState(_drawerState);
    }

    return (<div id="drawerWrapper">
        {/* Draw drawers */}
        <div className="z-10 flex justify-evenly w-full fixed top-0 left-0">
            {drawers.map((d, key) => {
                const bg = 'bg-purple-' + (100 * key + 400);
                return <div data-drawer={key} key={key} onClick={handleClick} className={`${bg} flex-1 cursor-pointer text-center p-1 text-white`}>{d}</div>
            })}
        </div>

        {/* Draw drawer contents */}
        {children.map((child, ndx) => {
            return (<div key={ndx} className={`${drawerState[ndx] ? 'translate-y-0' : '-translate-y-60'} h-60 w-full fixed top-8 left-0 duration-500 bg-slate-600 border border-white`}>
                {child}
            </div>)
        })}

    </div>
    )
}
