import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navigations/Navbar";
import Footer from "@/components/Navigations/Footer";
import Wrapper from "@/components/wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Romaric Lonfonyuy | portfolio",
  description: "My developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
    <Wrapper>

      <body className={inter.className}>

      <Navbar/>
        {children}
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit, vel. Voluptatem omnis delectus deserunt eum, molestias iure sed minus labore, est, exercitationem tempore repudiandae alias eveniet laudantium magnam ipsa sunt. Enim ducimus ipsam nam quaerat ex magni corporis dolorum iusto magnam distinctio aliquid quos, aperiam, error veritatis provident, similique perspiciatis nobis eaque totam! Animi delectus magni, inventore eum et magnam nesciunt eius veniam dolorum quis sequi cum quo doloribus officia ea laborum possimus dolor dolore quisquam cumque recusandae at. Nisi ad error accusantium repellendus, facere quae nesciunt. Quas perferendis fugiat vero optio, sequi quidem. Itaque, corporis sint. Dolor voluptates facere labore nobis quas fuga atque, possimus animi rem veritatis numquam unde nemo velit, repellendus eius blanditiis molestias deserunt dicta ducimus vel? Assumenda veniam at quae illum reiciendis officia magni, laborum facilis, praesentium soluta, provident et facere culpa minima omnis! Libero reiciendis ex, sequi qui possimus aspernatur aut quas corporis magni? Itaque fugit culpa magni consequuntur consequatur soluta, cumque corrupti sapiente aperiam, eum aliquid? Cum quis accusamus veniam consequatur, nihil, quos vero iure illo suscipit eligendi quae quas. Odit impedit eligendi nobis cumque aspernatur amet ab repudiandae neque corrupti dolorem. Ratione beatae quos fugit sapiente molestiae tempora unde, consectetur adipisci libero ipsam eum quidem natus tenetur velit, et esse consequatur amet, sint repellendus possimus quasi perferendis deleniti dignissimos illum. Minima ipsam nemo aspernatur alias eum sint, facere et. Atque, ducimus obcaecati! Facere, et qui dolorum nemo veritatis, quod est consectetur maxime id sunt nisi? Possimus dignissimos minus temporibus cumque repellat deserunt voluptate error tenetur, ipsa corrupti accusamus quia sapiente, earum explicabo id labore illo quos molestiae optio! Possimus dignissimos dolor ut, veritatis similique labore sequi repellendus esse pariatur molestiae ducimus. Saepe, temporibus ea fugiat illum impedit voluptatum explicabo culpa, provident quo similique eaque, rem doloribus in consectetur porro! Quas, incidunt suscipit!
        <Footer/>
      
        </body>
    </Wrapper>
  
    </html>
  );
}
