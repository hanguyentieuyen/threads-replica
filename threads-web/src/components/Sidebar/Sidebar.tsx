import React from 'react'

export default function Sidebar() {
  return (
    <div>
      <aside
        id='default-sidebar'
        className='fixed top-0 left-0 z-40 w-16 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
          <ul className='space-y-2 font-medium'>
            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <svg
                  aria-label='Trang chủ'
                  role='img'
                  viewBox='0 0 26 26'
                  className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Trang chủ</title>
                  <path
                    d='M2.25 12.8855V20.7497C2.25 21.8543 3.14543 22.7497 4.25 22.7497H8.25C8.52614 22.7497 8.75 22.5259 8.75 22.2497V17.6822V17.4997C8.75 15.1525 10.6528 13.2497 13 13.2497C15.3472 13.2497 17.25 15.1525 17.25 17.4997V17.6822V22.2497C17.25 22.5259 17.4739 22.7497 17.75 22.7497H21.75C22.8546 22.7497 23.75 21.8543 23.75 20.7497V12.8855C23.75 11.3765 23.0685 9.94815 21.8954 8.99883L16.1454 4.3454C14.3112 2.86095 11.6888 2.86095 9.85455 4.3454L4.10455 8.99883C2.93153 9.94815 2.25 11.3765 2.25 12.8855Z'
                    fill='currentColor'
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-width='2.5'
                  ></path>
                </svg>
              </a>
            </li>

            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <svg
                  aria-label='Tìm kiếm'
                  role='img'
                  viewBox='0 0 26 26'
                  className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Tìm kiếm</title>
                  <path
                    clipRule='evenodd'
                    d='M3.5 11.5C3.5 7.08172 7.08172 3.5 11.5 3.5C15.9183 3.5 19.5 7.08172 19.5 11.5C19.5 15.9183 15.9183 19.5 11.5 19.5C7.08172 19.5 3.5 15.9183 3.5 11.5ZM11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22C13.949 22 16.2023 21.1615 17.9883 19.756L22.3661 24.1339C22.8543 24.622 23.6457 24.622 24.1339 24.1339C24.622 23.6457 24.622 22.8543 24.1339 22.3661L19.756 17.9883C21.1615 16.2023 22 13.949 22 11.5C22 5.70101 17.299 1 11.5 1Z'
                    fill='currentColor'
                    fillRule='evenodd'
                  />
                </svg>
              </a>
            </li>
            <li>
              <a
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <svg
                  aria-label='Tạo'
                  role='img'
                  viewBox='0 0 12 12'
                  className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Tạo</title>
                  <path d='M6 2v8m4-4H2' stroke='currentColor' stroke-linecap='round' stroke-width='1.5'></path>
                </svg>
              </a>
            </li>
            <li>
              <a href='#'>
                <svg
                  aria-label='Thông báo'
                  role='img'
                  viewBox='0 0 32 32'
                  className='fill-transparent flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Thông báo</title>
                  <path
                    d='M5.5 12.8568C5.5 17.224 9.22178 21.5299 15.0332 25.2032C15.3554 25.397 15.7401 25.5909 16 25.5909C16.2703 25.5909 16.655 25.397 16.9668 25.2032C22.7782 21.5299 26.5 17.224 26.5 12.8568C26.5 9.11212 23.8698 6.5 20.4599 6.5C18.4847 6.5 16.9356 7.39792 16 8.74479C15.0851 7.40812 13.5257 6.5 11.5401 6.5C8.14059 6.5 5.5 9.11212 5.5 12.8568Z'
                    stroke='currentColor'
                    stroke-width='2.5'
                  ></path>
                </svg>
              </a>
            </li>
            <li>
              <a href='#'>
                <svg
                  aria-label='Trang cá nhân'
                  role='img'
                  viewBox='0 0 26 26'
                  className='fill-transparent flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Trang cá nhân</title>
                  <circle cx='13' cy='7.25' r='4' stroke='currentColor' stroke-width='2.5'></circle>
                  <path
                    d='M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z'
                    stroke='currentColor'
                    stroke-width='2.5'
                  ></path>
                </svg>
              </a>
            </li>
            <li>
              <a href='#'>
                <svg
                  aria-label='Ghim'
                  role='img'
                  viewBox='0 0 24 24'
                  className='fill-transparent  w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Ghim</title>
                  <path
                    d='M12 23.922c-.072 0-.166-.085-.283-.254a3.489 3.489 0 0 1-.352-.654 5.193 5.193 0 0 1-.293-.899 4.25 4.25 0 0 1-.117-.976v-5.576h2.08v5.576c0 .319-.039.644-.117.976a5.202 5.202 0 0 1-.293.899 3.489 3.489 0 0 1-.352.654c-.11.17-.201.254-.273.254ZM5.78 16.49c-.482 0-.87-.14-1.163-.42-.286-.286-.43-.66-.43-1.123 0-.748.2-1.478.596-2.187.397-.71.947-1.345 1.65-1.905a8.372 8.372 0 0 1 2.481-1.328c.95-.332 1.98-.498 3.086-.498 1.107 0 2.132.166 3.076.498a8.372 8.372 0 0 1 2.48 1.329c.71.56 1.26 1.194 1.651 1.904.397.71.596 1.439.596 2.187 0 .463-.143.837-.43 1.123-.286.28-.67.42-1.152.42H5.779Zm.488-1.787h11.455c.182 0 .257-.104.224-.312-.058-.43-.244-.86-.556-1.29-.313-.43-.73-.82-1.25-1.171a6.823 6.823 0 0 0-1.836-.85A7.792 7.792 0 0 0 12 10.758a7.89 7.89 0 0 0-2.314.322 6.85 6.85 0 0 0-1.827.85c-.52.351-.937.742-1.25 1.172-.312.43-.5.859-.566 1.289-.033.208.042.312.225.312Zm-.84-13.086c0-.338.117-.618.351-.84.241-.228.554-.341.938-.341h10.566c.384 0 .694.113.928.341.24.222.361.502.361.84 0 .352-.136.7-.41 1.045a5.307 5.307 0 0 1-.693.723c-.293.26-.632.534-1.016.82-.384.287-.784.573-1.201.86l.361 5.41h-1.875l-.361-6.24c-.013-.17.042-.284.166-.342.3-.163.583-.326.85-.489.273-.162.514-.315.722-.459.209-.143.381-.27.518-.38.137-.118.23-.202.283-.254.046-.053.055-.098.03-.137-.02-.04-.056-.059-.108-.059H8.152a.123.123 0 0 0-.107.059c-.02.039-.01.084.03.137.051.052.146.136.282.253.144.111.32.238.528.381.215.144.452.297.713.46.267.162.553.325.859.488.124.058.182.172.176.341l-.371 6.24H8.377l.371-5.41a32.5 32.5 0 0 1-1.21-.859 19.68 19.68 0 0 1-1.017-.82 5.57 5.57 0 0 1-.683-.723c-.274-.345-.41-.693-.41-1.045Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </a>
            </li>
            <li>
              <a href='#'>
                <svg
                  aria-label='Xem thêm'
                  role='img'
                  viewBox='0 0 24 24'
                  className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                >
                  <title>Xem thêm</title>
                  <rect className='' rx='1.25' x='3' y='7'></rect>
                  <rect className='' rx='1.25' x='3' y='15'></rect>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
