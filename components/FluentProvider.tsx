"use client";
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import {ReactNode} from "react";

export function FluentProviderWrapper({children}: {children: ReactNode}) {
    return (
        <FluentProvider theme={webLightTheme}>
            {children}
        </FluentProvider>
    )
}