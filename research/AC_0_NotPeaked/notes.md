<style>

</style>

# Something with Quantum Circuits and Expectation of Post-Processing AC0

## Problems that still Need to be Solved
The below probably has bugs, but one thing that I do not quite know how to estimate is

$$
\Pr[n p \leq \sum_{\ell} c_\ell \text{Mon}(\ell) < (n + 1) p]
$$

where $p, n \in \Z$ and $\text{Mon}(\ell)$ is a random variable representing a multi-variate monomial with coefficient one and values always in between 0 and 1. $c_\ell$ is some set of coefficients.


### Some Papers/ References

We can get non-trivial upper and lower bounds on the expectation of post-processing $\ACZ$ circuits by relying on the two following papers

- [Probabilistic polynomials, AC0 functions and the polynomial-time hierarchy](https://www.sciencedirect.com/science/article/pii/030439759390214E?ref=pdf_download&fr=RR-2&rr=8236c9c25bdf3af9). We can maybe look for better results, but here we have a probabilistic polynomial over $\Z[X_1, \dots, X_n]$ with one sided error $\eps$ and *norm bound* (i.e. the maximum absolute value of the coefficients)

$$
n^{O(\log (1/\eps) \cdot \log n)}
$$

on all probabilisitc polynomials.
Note that this implies that for any probabilist polynomial, $f$, we have that

$$
f(x_1, \dots, x_n) \leq O(n) \cdot n^{O(\log (1/\eps) \cdot \log n)}
$$

as we assume that we have $O(n)$ terms in the polynomial. Let $L = O(n) \cdot n^{O(\log (1/\eps) \cdot \log n)}$.

- [Fast polynomial factorization and modular composition](http://users.cms.caltech.edu/~umans/papers/KU08-final.pdf)
  This is quite a fascinating paper IMO and something that cryptographers are hoping to use (though the parameters there do not quite work out). The key part that we will focus on is **Section 4**. The idea is actually rather simple and will be outlined below. No need to go through the paper as it is doing a lot of other things that we do not need.

### Using CRT
We have from the CRT (Chinese Remainder Theorem), given any $f(x)$ where $0 \leq f(x) \leq L$,

\begin{align*}
a_1 = f(x) \mod p_1 \\
a_2 = f(x) \mod p_2 \\
\;\;\vdots \\
a_k = f(x) \mod p_k \\
\end{align*}
where $p_1 \cdot p_2 \dots \cdot p_k \geq L$, then we can uniquely recover $f(x)$. Note that $k \in O(\log L)$.

Moreover, we can find fixed constants $\{M_i\}, \{N_i\}$ (from [Wikipedia](<https://en.wikipedia.org/wiki/Chinese_remainder_theorem#:~:text=In%20mathematics%2C%20the%20Chinese%20remainder,are%20pairwise%20coprime%20(no%20two)>)) such that

$$
f(x) = \sum_{i \in [k]} a_i M_i N_i.
$$

Now, this is cool beans.

Note that if we have the expectations for $a_i$ we can get the expectation for $f$!

-----------
## Aside: Fixing non {0, 1} outputs of a polynomial g

<!-- TODO: coefficient norm bound??? -->

Say that we have a polynomial $g$ that outputs values in $\Z/p\Z$. Note that
if $g \in \Z[X]$ but $g(x)$ is norm bounded by some $L'$, then we can assume that
 $g \in \Z/p\Z$ for some $p > L'$.

<!-- TODO: check this above -->

We want to get a polynomial $g'$ that outputs values in $\{0, 1\}$ and that $g(x) = g'(x)$ if $g(x) \in \binSet$.
Seems easy enough right? Lets use a brute force technique to map all $g(x) > 1$ to $0$.

$$
g'(x) = \prod_{j \in \{0, \dots, p - 1\} \setminus \{1\}} (1 - j)^{-1} (g(x) - j).
$$

We can see that when $g(x) \neq 1$, we have $g'(x) = 0$. When $g(x) = 1$, then

$$
g'(x) = \prod_j (1 - j)^{-1} (1 - j) = 1.
$$

Another note is that this basically means that the total degree of $g'(x)$ is something like $(p - 1) \cdot \deg(g)$.

-----------
## Back to the main show. Using the above and the CRT

Note that if we want to use the above technique with $g'$ we will have a major issue.

If our $p$ is $\text{poly}(n)$ we are in trouble.
If we want our $\eps$ to have some inverse polynomial error, then we need to do some tricks.

### CRT and Unique Identification

We can note that CRT guarantees us that there is a unique $b_1, \dots, b_k$ such that

$$
\sum_{i \in [k]} b_i M_i N_i = 1.
$$

So, for every $p_i$ reduced polynomial, $f_i$, we create a polynomial
$f'_i$ such that $f'_i(x) = b_i$ if $f_i(x) = b_i$ and $f'_i(x) = 0$ otherwise.
Note that this increases the degree of $f_i$ by $O(p) = O(\log L)$.

### Lower Bounding the Expectation

So then, if we want to lower bound $\E[C(x)]$ where $x \sim \distrib$ and $C$ is an $\ACZ$ circuit, we simply need to find $\E[f'(x)]$ where $f'$ is the polynomial
that sends all outputs not equal to 1 to 0. We can see this as

$$
\E[f'(x)] = \Pr[f'(x) = 1] \leq \Pr[C(x) = 1] = \E[C(x)].
$$

Cool! So we can maybe find a lower bound. We can also use the same technique to upper bound the expectation by looking at the negation of $C$.

Okay so then,

\begin{align*}
\E[f'(x)] = \E\left[\sum_{i \in [k]} (f'_i(x) \text{ mod }p_i) M_i N_i\right] \\
= \sum_{i \in [k]} M_i N_i\E\left[(f'_i(x) \text{ mod }p_i) \right]. \\
\end{align*}

Now we need to find the expectation of $\E\left[(f'_i(x) \text{ mod }p_i) \right]$.
We will show how to do this in the next section.

<!-- TODO: -->

### Approximating the Expectation of a Modulo Reduced Polynomial
Let $g$ be a polynomial over finite field $\Z/p\Z$ with $T$ terms. We can express $g$ as

$$
g = \sum_{\ell \in T} c_\ell \text{Mon}(\ell)
$$

where $\text{Mon}$ is a monomial with coefficient 1 associated with the $\ell$ th term of $g$ and $c_\ell$ is the coefficient of the $\ell$ th term.

We abstract away the details of Mon and assume that we can estimate the expectation of the monomial and that $0 \leq \E[\text{Mon}(\ell)] \leq 1$ for all $\ell$.

$$
\E\left[(g(x) \text{ mod }p_i) \right] = \E\left[\sum_{\ell} c_\ell \text{Mon}(\ell) \text{ mod }p_i \right].
$$

For simplicity let $M_\ell$ be the random variable associated to $c_\ell \text{Mon}(\ell)$. Because of our restriction on $\text{Mon}$, we have that $0 \leq M_\ell < p$ and so $M_\ell = M_\ell \text{ mod } p$.

Cool! So we can find an explicit formula to calculate $\E[g(x)]$. Let $S = \sum_{\ell} M_\ell$. Then,

\begin{align*}
\E_{s \sim \distrib}[g(s)] = \sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \mod p \cdot \Pr[s] \\
= \sum_{s \in \distrib, 0 \leq S < p} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] \\
+ \sum_{s \in \distrib,\; p \leq S < 2p} \left(\sum_{\ell} M_\ell(s) - p\right) \cdot \Pr[s] \\
... + \sum_{s \in \distrib,\; (\ell - 1)p \leq S < \ell p} \left(\sum_{\ell} M_\ell(s) - (\ell - 1)p\right) \cdot \Pr[s] \\
= \sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] - p \Pr[p \leq S < 2p] \\ - 2p \Pr[2p \leq S < 3p] \dots (\ell - 1)p \Pr[S \geq (\ell - 1)p].
\end{align*}

Note that $\sum_{s \in \distrib} \left(\sum_{\ell} M_\ell(s)\right) \cdot \Pr[s] = \sum_{\ell} \E[M_\ell]$.

Unfortunately, I do not quite know how to approximate the probabilities above (that $p \leq S < 2p$ and so on). It seems like we may be able to get something like a bound here via a generalization of Chebyshev's inequality to higher order moments
but this seems tenuous at best.

### TODO: show that we can approximate with a polynomial number of samples
<!-- TODO: detail **exactly** how to do the mod thing -->
I think for this we need to do 2 things

1. Show that we can approximate $\E[f_i(x)]$ to be within $\eps$ of the true value with a polynomial number of samples in $1/\eps$.
2. And then show that M_i, N_i are polynomial in $1/\eps$ to ensure that we are not "magnifying" errors too much.
