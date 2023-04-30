#!/bin/sh
#
# gp-mqtt-client | Simple MQTT Client
# Copyright (C) 2021-2023, Greg PFISTER. MIT License
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use system

echo "Latest Node.js v14"
nvm uninstall v14
nvm install v14 && npm i -g npm@latest

echo "Latest Node.js v16"
nvm uninstall v16
nvm install v16 && npm i -g npm@latest

echo "Latest Node.js v18"
nvm uninstall v18
nvm install v18 && npm i -g npm@latest

echo "Latest Node.js v19"
nvm uninstall v19
nvm install v19 && npm i -g npm@latest

nvm use v18

# End
