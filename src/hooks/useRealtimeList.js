import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';


export default function useRealtimeList(path) {
const [items, setItems] = useState([]);
useEffect(() => {
const r = ref(db, path);
const unsub = onValue(r, (snap) => {
const data = snap.val() || {};
setItems(Object.keys(data).map(k => ({ id: k, ...data[k] })));
});
return () => unsub();
}, [path]);
return items;
}