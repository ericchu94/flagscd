# Maintainer: Eric Chu <eric@ericchu.net>
pkgname=flagscd-git
pkgver=v2.0.0.r0.db6948a
pkgrel=1
pkgdesc='a Flags client daemon'
arch=('any')
url='https://github.com/ericchu94/flagscd'
license=('GPL')
depends=('nodejs'
         'npm')
provides=("${pkgname%-git}")
conflicts=("${pkgname%-git}")
source=('git://github.com/ericchu94/flagscd.git')
md5sums=('SKIP')
install="${pkgname%-git}.install"

pkgver() {
  cd "$srcdir/${pkgname%-git}"
  printf "%s" "$(git describe --long --tags | sed 's/\([^-]*-\)g/r\1/;s/-/./g')"
}

package() {
  cd "$srcdir/${pkgname%-git}"

  mkdir -p "$pkgdir/opt/${pkgname%-git}"
  cp flagscd.js package.json yarn.lock "$pkgdir/opt/${pkgname%-git}"

  mkdir -p "$pkgdir/etc/${pkgname%-git}"
  cp flagscd.json "$pkgdir/etc/${pkgname%-git}/flagscd.json.example"

  mkdir -p "$pkgdir/usr/bin"
  ln -s "/opt/${pkgname%-git}/flagscd.js" "$pkgdir/usr/bin/flagscd"

  mkdir -p "$pkgdir/usr/lib/systemd/system"
  cp flagscd.service "$pkgdir/usr/lib/systemd/system"
}
