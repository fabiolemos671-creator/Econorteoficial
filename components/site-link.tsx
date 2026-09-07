import type {ComponentProps} from 'react';

// Native navigation works with left-click, touch, keyboard and modified clicks,
// including when JavaScript is unavailable. CSS animates each arriving page.
export default function SiteLink(props:ComponentProps<'a'>){return <a {...props}/>}
