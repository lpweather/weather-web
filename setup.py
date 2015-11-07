#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import find_packages
from distutils.core import setup

setup(
    author=u'Benj Fassbind',
    author_email='randombenj@gmail.com',
    name='Weather web',
    description='Web frontend for lpweather stations',
    version="0.0.0",
    url='',
    license='MIT License',
    packages = find_packages(),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries',
        'Topic :: Software Development :: Libraries :: Python Modules',
        ],
    install_requires=[
        open("requirements.txt").readlines(),
    ],
)
