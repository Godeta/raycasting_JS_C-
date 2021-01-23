// 1ère vidéo https://www.youtube.com/watch?v=xW8skO7MFYw
// uppgrade https://youtu.be/HEb2akswCcw
// g++ main.cpp -o main  start main
#include <iostream>
#include <vector>
#include <utility>
#include <algorithm>
#include <chrono>
using namespace std;
#include <cmath>
#include <stdio.h>
#include <Windows.h>

//l'écran, un tableau 
int nScreenWidth = 120;
int nScreenHeight = 40;
//infos sur le joueur (position et angle)
float fPlayerX= 8.0f;
float fPlayerY = 8.0f;
float fPlayerA = 0.0f;
//infos sur la map
int nMapHeight = 16;
int nMapWidth =16;
// champ de vision
float fFOV = 3.14159/ 4.0;
float fDepth = 16;
// gestion du temps (pour les frames)
auto time1 = chrono::system_clock::now();
auto time2 = chrono::system_clock::now();

int main() {
    // utiliser cout est trop lent on va donc utiliser une autre méthode pour afficher
    // for(int i = 0; i<1000000; i++) {
    // cout << "hello" << i << endl ;
    // }

    //créer un buffer pour l'écran
    wchar_t *screen = new wchar_t[nScreenWidth*nScreenHeight];
    HANDLE hConsole = CreateConsoleScreenBuffer(GENERIC_READ | GENERIC_WRITE,0,NULL,CONSOLE_TEXTMODE_BUFFER,NULL);
    SetConsoleActiveScreenBuffer(hConsole);
    DWORD dwBytesWritten =0;
    // la map est de dimension 16*16
    wstring map;
    map += L"################";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"##............##";
    map += L"################";
    
    //boucle du jeu
    while(true) {
        //gestion du temps pour avoir un taux de frames régulé
        time2 = chrono::system_clock::now();
        chrono::duration<float> elapsedTime = time2-time1;
        time1=time2;
        float fElapsedTime = elapsedTime.count();
        // contrôles du joueur
        // gérer la rotation, si il appuie sur
        if(GetAsyncKeyState((unsigned short)'Q')& 0x8000) {
            fPlayerA -= (0.1f) * fElapsedTime;
        }
        if(GetAsyncKeyState((unsigned short)'D')& 0x8000) {
            fPlayerA += (0.1f)* fElapsedTime;
        }
        if(GetAsyncKeyState((unsigned short)'Z')& 0x8000) {
            fPlayerX += sinf(fPlayerA)*5.0f*fElapsedTime;
            fPlayerY += cosf(fPlayerA)*5.0f*fElapsedTime;
        }
        if(GetAsyncKeyState((unsigned short)'S')& 0x8000) {
            fPlayerX -= sinf(fPlayerA)*5.0f*fElapsedTime;
            fPlayerY -= cosf(fPlayerA)*5.0f*fElapsedTime;
        }

        for(int x=0; x<nScreenWidth; x++) {
            // pour chaque colonnes, calculer le rayon projeter dans l'espace
            float fRayAngle =(fPlayerA - fFOV/2.0f) + ((float)x/ (float)nScreenWidth)*fFOV;
            float fDistanceToWall = 0;
            bool bHitWall = false;
            //vecteurs pour les rayons dans l'espace du joueur
            float fEyeX = sinf(fRayAngle);
            float fEyeY = cosf(fRayAngle);

            while(!bHitWall && fDistanceToWall < fDepth){
                fDistanceToWall += 0.1f;
                int nTestX = (int) (fPlayerX + fEyeX*fDistanceToWall);
                int nTestY = (int)(fPlayerY + fEyeY*fDistanceToWall);

                // test on est en dehors de la map
                if(nTestX <0 || nTestX >=nMapWidth || nTestY <0 || nTestY >= nMapHeight) {
                    bHitWall = true;
                    fDistanceToWall = fDepth;
                }
                else {
                    // test si la cellule est un mur, donc si le rayon dans la map est à la postion d'un #
                    if (map.c_str()[nTestX * nMapWidth + nTestY] == '#'){
                        bHitWall = true;
                    }
                }
                // calculer la distance du plafond et du sol
                int nCeiling = (float) (nScreenHeight/2.0) - nScreenHeight/ ((float)fDistanceToWall);
                int nFloor = nScreenHeight - nCeiling;
                // nShade est là pour afficher les murs selon leur distance
                short nShade = ' ';
                if (fDistanceToWall <= fDepth / 4.0f)			nShade = 0x2588;	// très proche, char très clair
                else if (fDistanceToWall < fDepth / 3.0f)		nShade = 0x2593;
                else if (fDistanceToWall < fDepth / 2.0f)		nShade = 0x2592;
                else if (fDistanceToWall < fDepth)				nShade = 0x2591;
                else											nShade = ' ';		// très loin, sombre

                for(int y=0; y<nScreenHeight; y++) {
                    if(y<nCeiling) {
                        screen[y*nScreenWidth+x] = ' ';
                    }
                    else if (y>nCeiling && y <=nFloor) {
                        screen[y*nScreenWidth+x] = nShade;
                    }
                    else {
                        screen[y*nScreenWidth+x]= ' ';
                    }
                }
            }
        }
        //pour écrire dans la console
        screen[nScreenWidth * nScreenHeight -1] = '\0';
        WriteConsoleOutputCharacterW(hConsole,screen,nScreenWidth*nScreenHeight,{0,0},&dwBytesWritten);
    }
    return 0;
}

